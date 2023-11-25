import { expect } from "@assertive-ts/core";

import { Axios, axios } from "../src";
import { RxjsAxios } from "../src/lib/RxjsAxios";

describe("[Unit] index.test.ts", () => {
  context("the default instance is imported", () => {
    it("returns a RxjsAxios instance", () => {
      expect(axios).toBeInstanceOf(RxjsAxios);
    });
  });

  context("when the Axios class is imported", () => {
    it("exports RxjsAxios class as Axios", () => {
      expect(Axios).toBeEqual(RxjsAxios);
    });
  });
});
