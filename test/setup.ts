import { usePlugin } from "@assertive-ts/core";
import { SinonPlugin } from "@assertive-ts/sinon";
import Sinon from "sinon";
import { afterAll, beforeAll, beforeEach } from "vitest";

import { server } from "./helpers/server";

usePlugin(SinonPlugin);

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  server.close();
});

beforeEach(() => {
  Sinon.restore();
  server.resetHandlers();
});
