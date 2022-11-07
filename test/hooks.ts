import Sinon from "sinon";

import { server } from "./helpers/server";

export const mochaHooks: () => Mocha.RootHookObject = () => {
  return {
    beforeAll() {
      server.listen();
    },
    afterEach() {
      Sinon.restore();
      server.resetHandlers();
    },
    afterAll() {
      server.close();
    },
  };
};
