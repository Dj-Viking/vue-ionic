import "@babel/register";

import App from "../server/src/index";


export default async function() {
  global.httpServer = App;
  await global.httpServer.listen();
};

