import Sinon from "sinon";

import { server } from "./helpers/server";

export const mochaHooks: () => Mocha.RootHookObject = () => {
  return {
    afterAll() {
      server.close();
    },
    afterEach() {
      Sinon.restore();
      server.resetHandlers();
    },
    beforeAll() {
      server.listen();
    },
  };
};
