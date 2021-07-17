require('dotenv').config();
import path from "path";
import "reflect-metadata";
import { createConnection } from "typeorm";
// import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import express from "express";
// import { graphqlHTTP } from "express-graphql";
import session from "express-session";
import connectRedis from "connect-redis";
import Redis from "ioredis";
import cors from "cors";
import { COOKIE_NAME, IS_PROD } from "./constants";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { User } from "./entities/User";
import { UserResolver } from './resolvers/user';
import { MyContext, ANSI_ESCAPES } from "./types";
import { GraphQLSchema } from "graphql";
const {
  DB_NAME,
  DB_USER,
  // DB_TYPE,
  DB_PASSWORD,
  SECRET,
  CORS_ALLOWED
} = process.env;

export const startServer = async (): Promise<void> => {
  console.log("hello world!!!!");
  //start postgres db connection

  //heroku settings???
  await createConnection({
    type: "postgres",
    url: IS_PROD ? process.env.DATABASE_URL : undefined,
    database: !IS_PROD ? DB_NAME : undefined,
    password: !IS_PROD ? DB_PASSWORD : undefined,
    username: !IS_PROD ? DB_USER : undefined,
    logging: true, //dont log if we are in prod
    synchronize: true,
    ssl: IS_PROD,
    extra: IS_PROD && {
      ssl: {
        rejectUnauthorized: false,
      },
    },
    entities: [User]
  });

  //setup express
  const app = express();
  const RedisStore = connectRedis(session);

  let RedisClient: Redis.Redis;
  let apolloServer: ApolloServer;
  let MyGraphQLSchema: GraphQLSchema;

  RedisClient = new Redis(process.env.REDIS_TLS_URL || undefined, {
    db: IS_PROD ? 0 : undefined,
    tls: IS_PROD ? {
      rejectUnauthorized: !IS_PROD,
      requestCert: IS_PROD,
    } : undefined
  } || undefined);

  MyGraphQLSchema = await buildSchema({
    resolvers: [UserResolver],
    validate: false
  });

  app.use(cors({
    origin: new RegExp(CORS_ALLOWED as string),
    credentials: true
  }));

  //redis middleware for auth 
  app.use(session({
    name: COOKIE_NAME,
    store: new RedisStore({
      client: RedisClient,
      disableTouch: false,
      ttl: 86400,
      host: !IS_PROD ? "localhost" : undefined,
      port: !IS_PROD ? 6739 : undefined
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
      httpOnly: !IS_PROD as boolean, // if true cookie works in http
      sameSite: "none", //protecting csrf
      secure: IS_PROD as boolean //cookie only works in https
    },
    secret: SECRET as string,
    resave: false,
    saveUninitialized: false
  }));

  apolloServer = new ApolloServer({
    schema: MyGraphQLSchema,
    context: ({ req, res }): MyContext => ({ req, res, RedisClient })
  });

  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: new RegExp(CORS_ALLOWED as string),
      credentials: true
    },
  });

  // app.use('/graphql', (req, res) => {
  // 	console.log('request object in the /graphql request', req);

  // 	return graphqlHTTP({
  // 		schema: MyGraphQLSchema,
  // 		graphiql: !IS_PROD, // or whatever you want
  // 		context: { req, res },
  // 	})(req, res);
  // });

  //EXPRESS MIDDLEWARE FUNCTIONS
  app.use(express.urlencoded({
    extended: false
  }));
  app.use(express.json());
  //STATIC PUBLIC FRONT END ASSETS WHILE IN DEVELOPMENT

  //IF-ENV IN DEPLOYMENT
  if (process.env.NODE_ENV === 'production') {
    //STATIC ASSETS FROM VUE BUILD FOLDER
    app.use(express.static(
      path.join(__dirname, '../../client/dist')
    ));
    // IF TRAVELS ANY ROUTE OUTSIDE VUE'S CURRENT PAGE REDIRECT TO ROOT
    app.get('*', (_req, res) => {
      res.sendFile(path.join(
        __dirname, '../client/dist/index.html'
      ));
    });
    //REDIRECT HTTP TRAFFIC TO HTTPS
    app.use((req, res, next) => {
      if (req.header('x-forwarded-proto') !== 'https') res.redirect(`https://${req.header('host')}${req.url}`);
      next();
    });
  }

  app.use('/', (_, res) => {
    res.status(200).sendFile(path.join(
      __dirname, '../client/dist/index.html'
    ));
  });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(
      ANSI_ESCAPES.yellow,
      `server started on ${PORT}`,
      ANSI_ESCAPES.reset
    );
    console.log(
      ANSI_ESCAPES.purple,
      `graphql started? ${apolloServer.graphqlPath}`,
      ANSI_ESCAPES.reset
    );

  });


}
startServer().catch((e: Error) => console.log(ANSI_ESCAPES.red,
  `error while server started ` + e.name + ' ' + e.stack,
  ANSI_ESCAPES.reset));
/** graph ql settings
 * {
  "editor.cursorShape": "line",
  "editor.fontFamily": "'Source Code Pro', 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace",
  "editor.fontSize": 14,
  "editor.reuseHeaders": true,
  "editor.theme": "dark",
  "general.betaUpdates": false,
  "prettier.printWidth": 80,
  "prettier.tabWidth": 2,
  "prettier.useTabs": false,
  "request.credentials": "include", *****super important will not set cookies in browser if set to "omit" !!!!
  "schema.disableComments": true,
  "schema.polling.enable": true,
  "schema.polling.endpointFilter": "*localhost*",
  "schema.polling.interval": 2000,
  "tracing.hideTracingResponse": true,
  "queryPlan.hideQueryPlanResponse": true
}
 */