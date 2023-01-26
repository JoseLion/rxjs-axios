import { expect } from "@stackbuilders/assertive-ts";
import { AxiosError, AxiosHeaders, AxiosResponse } from "axios";
import Sinon from "sinon";

import { observify } from "../../src/lib/observify";
import { delay } from "../helpers/async.helpers";

const RESPONSE: AxiosResponse<string> = {
  config: { headers: AxiosHeaders.from() },
  data: "ok",
  headers: { ["Content-Type"]: "plain/text" },
  status: 200,
  statusText: "OK",
};

const REQUEST_ERROR = new AxiosError("Something went wrong", "Bad Request");

const controller = new AbortController();

describe("[Unit] observify.test.ts", () => {
  describe(".observify", () => {
    context("when the request promise is resolved", () => {
      context("and the observable is not unsubscribed", () => {
        it("sets the axios response on the next value and completes the observable", done => {
          const observable = observify(
            () => Promise.resolve<AxiosResponse>(RESPONSE),
            controller,
          );

          observable.subscribe({
            complete: done,
            error: error => expect(error).not.toBePresent(),
            next: response => expect(response).toBeEqual(RESPONSE),
          });
        });
      });

      context("and the observable is unsubscribed", () => {
        it("does not set the next value and cancels the request", done => {
          const abort = Sinon.spy(controller, "abort");
          const observable = observify(
            () => delay(10).then(() => RESPONSE),
            controller,
          );

          const subscription = observable.subscribe({
            complete: done,
            error: error => expect(error).not.toBePresent(),
            next: response => expect(response).not.toBePresent(),
          });

          subscription.unsubscribe();

          delay(20)
            .then(() => Sinon.assert.calledOnce(abort))
            .then(done)
            .catch(done);
        });
      });
    });

    context("when the request promise is rejected", () => {
      context("and the observable is not unsubscribed", () => {
        it("sets the axios error on the error value and completes the observable", done => {
          const observable = observify(
            () => Promise.reject(REQUEST_ERROR),
            controller,
          );

          observable.subscribe({
            complete: done,
            error: (error: AxiosError) => {
              expect(error).toBeEqual(REQUEST_ERROR);
              done();
            },
            next: response => expect(response).not.toBePresent(),
          });
        });
      });

      context("and the observable is unsubscribed", () => {
        it("does not set the error value and cancels the request", done => {
          const abort = Sinon.spy(controller, "abort");
          const observable = observify(
            () => delay(10).then(() => Promise.reject(REQUEST_ERROR)),
            controller,
          );

          const subscription = observable.subscribe({
            complete: done,
            error: error => expect(error).not.toBePresent(),
            next: response => expect(response).not.toBePresent(),
          });

          subscription.unsubscribe();

          delay(20)
            .then(() => Sinon.assert.calledOnce(abort))
            .then(done)
            .catch(done);
        });
      });
    });
  });
});
