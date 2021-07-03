import "@babel/register";

import App from "../server/src/index";


export default async function(): Promise<void> {
  global.httpServer = App;
  await global.httpServer.listen();
};

