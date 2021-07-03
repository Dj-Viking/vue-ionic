require('dotenv').config();
import "reflect-metadata";
import { createConnection } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
// import express from "express";
// import cors from "cors";
// import Redis from "ioredis";
// import session from "express-session";
// import connectRedis from "connect-redis";
// import { COOKIE_NAME } from "constants";
const {
  DB_NAME,
  DB_USER,
  DB_TYPE,
  DB_PASSWORD
} = process.env;

(async function Main(){
  console.log("hello world!!!!");
  
  const connection = await createConnection({
    type: DB_TYPE as PostgresConnectionOptions["type"],
    database: DB_NAME as string,
    username: DB_USER as string,
    password: DB_PASSWORD as string,
    logging: true,
    synchronize: true, //usually true during dev
    entities: []
  });
  console.log("connection", connection);
  

})().catch(console.log);