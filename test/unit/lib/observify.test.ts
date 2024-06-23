/* eslint deprecation/deprecation: "off" -- RxJS v5/v6 compat. */
import { expect } from "@assertive-ts/core";
import { AxiosError, AxiosHeaders } from "axios";
import Sinon from "sinon";
import { describe, it, suite } from "vitest";

import { observify } from "../../../src/lib/observify";
import { delay } from "../../helpers/async.helpers";

import type { AxiosResponse } from "../../../src/lib/RxjsAxios";

const RESPONSE: AxiosResponse<string> = {
  config: { headers: AxiosHeaders.from() },
  data: "ok",
  headers: { "Content-Type": "plain/text" },
  status: 200,
  statusText: "OK",
};

const REQUEST_ERROR = new AxiosError("Something went wrong", "Bad Request");

suite("[Unit] observify.test.ts", () => {
  describe("when the request promise is resolved", () => {
    describe("and the observable is not unsubscribed", () => {
      it("sets the axios response on the next value and completes the observable", async () => {
        const observable = observify(() => Promise.resolve<AxiosResponse<unknown>>(RESPONSE));

        observable.subscribe({
          error: error => expect(error).not.toBePresent(),
          next: response => expect(response).toBeEqual(RESPONSE),
        });

        await expect(observable.toPromise()).toBeResolvedWith(RESPONSE);
      });
    });

    describe("and the observable is unsubscribed", () => {
      it("does not set the next value and cancels the request", async () => {
        const spy = Sinon.spy();
        const observable = observify(signal => {
          signal.addEventListener("abort", spy);
          return delay(10).then(() => RESPONSE);
        });

        const subscription = observable.subscribe({
          error: error => expect(error).not.toBePresent(),
          next: response => expect(response).not.toBePresent(),
        });

        expect(spy).toNeverBeCalled();
        subscription.unsubscribe();

        expect(spy).toBeCalledOnce();
        await expect(observable.toPromise()).toBeResolvedWith(RESPONSE);
      });
    });
  });

  describe("when the request promise is rejected", () => {
    describe("and the observable is not unsubscribed", () => {
      it("sets the axios error on the error value and completes the observable", async () => {
        const observable = observify(() => Promise.reject(REQUEST_ERROR));

        observable.subscribe({
          error: (error: AxiosError) => expect(error).toBeEqual(REQUEST_ERROR),
          next: response => expect(response).not.toBePresent(),
        });

        await expect(observable.toPromise()).toBeRejectedWith(REQUEST_ERROR);
      });
    });

    describe("and the observable is unsubscribed", () => {
      it("does not set the error value and cancels the request", async () => {
        const spy = Sinon.spy();
        const observable = observify(signal => {
          signal.addEventListener("abort", spy);
          return delay(10).then(() => Promise.reject(REQUEST_ERROR));
        });

        const subscription = observable.subscribe({
          error: error => expect(error).not.toBePresent(),
          next: response => expect(response).not.toBePresent(),
        });

        expect(spy).toNeverBeCalled();
        subscription.unsubscribe();

        expect(spy).toBeCalledOnce();
        await expect(observable.toPromise()).toBeRejectedWith(REQUEST_ERROR);
      });
    });
  });
});
