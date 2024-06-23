import { expect } from "@assertive-ts/core";
import { describe, it, suite } from "vitest";

import { RxjsAxios } from "../../src/lib/RxjsAxios";
import { Axios, axios } from "../../src/main";

suite("[Unit] index.test.ts", () => {
  describe("the default instance is imported", () => {
    it("returns a RxjsAxios instance", () => {
      expect(axios).toBeInstanceOf(RxjsAxios);
    });
  });

  describe("when the Axios class is imported", () => {
    it("exports RxjsAxios class as Axios", () => {
      expect(Axios).toBeEqual(RxjsAxios);
    });
  });
});
