/* eslint deprecation/deprecation: "off" -- RxJS v5/v6 compat. */
import { TypeFactories, expect } from "@assertive-ts/core";
import originalAxios from "axios";
import FormData from "form-data";
import { Observable } from "rxjs";
import { delay, map, repeat } from "rxjs/operators";
import Sinon from "sinon";
import { describe, it, suite } from "vitest";

import { RxjsAxios } from "../../../src/lib/RxjsAxios";
import { axios } from "../../../src/main";

import type { User } from "../../helpers/mocks";

suite("[Unit] RxjsAxios.test.ts", () => {
  describe(".of", () => {
    it("creates an RxjsAxios instance from another Axios instance", () => {
      const rxjsAxios = RxjsAxios.of(originalAxios);

      // eslint-disable-next-line @typescript-eslint/dot-notation
      expect(rxjsAxios["axios"]).toBeEqual(originalAxios);
    });
  });

  describe(".create", () => {
    it("creates a new RxjsAxios instance from a config object", () => {
      const rxjsAxios = RxjsAxios.create({ baseURL: "http://localhost:8080" });

      expect(rxjsAxios).not.toBeSame(axios);
    });
  });

  describe(".isAxiosError", () => {
    it("calls the same Axios method", () => {
      const spy = Sinon.spy(originalAxios, "isAxiosError");

      RxjsAxios.isAxiosError("foo");

      Sinon.assert.calledOnceWithExactly(spy, "foo");
    });
  });

  describe(".isCancel", () => {
    it("calls the same Axios method", () => {
      const spy = Sinon.spy(originalAxios, "isCancel");

      RxjsAxios.isCancel("foo");

      Sinon.assert.calledOnceWithExactly(spy, "foo");
    });
  });

  describe(".toFormData", () => {
    it("calls the same Axios method", () => {
      const spy = Sinon.spy(originalAxios, "toFormData");

      RxjsAxios.toFormData({ });

      Sinon.assert.calledOnceWithExactly(spy, { }, undefined, undefined);
    });
  });

  describe(".formToJSON", () => {
    it("calls the same Axios method", () => {
      const spy = Sinon.spy(originalAxios, "formToJSON");
      const formData = new FormData();

      RxjsAxios.formToJSON(formData);

      Sinon.assert.calledOnceWithExactly(spy, formData);
    });
  });

  describe("#defaults", () => {
    it("returns the instance defaults", () => {
      const rxjsAxios = RxjsAxios.create({ baseURL: "http://localhost:8080" });

      expect(rxjsAxios.defaults).toPartiallyMatch({ baseURL: "http://localhost:8080" });
    });
  });

  describe("#interceptors", () => {
    it("returns the instance interceptors", () => {
      const rxjsAxios = RxjsAxios.of(originalAxios);

      expect(rxjsAxios.interceptors).toBeSame(originalAxios.interceptors);
    });
  });

  describe(".request", () => {
    const request = axios.request({ method: "GET", url: "http://localhost:8080/users" });

    it("returns an Observable", () => {
      expect(request).toBeInstanceOf(Observable);
    });

    describe("when the observable is subscribed", () => {
      it("resolves to an axios response", async () => {
        const observable = axios.request({ method: "GET", url: "http://localhost:8080/users" });
        observable.subscribe(response => {
          expect(response).toPartiallyMatch({
            data: [{ lastname: "Doe", name: "John" }],
            status: 200,
          });
        });

        await expect(observable.toPromise()).toBeResolved();
      });
    });

    describe("when the observable is unsubscribed", () => {
      it("cancels the request", async () => {
        const observable = axios.request({ method: "GET", url: "http://localhost:8080/users" });
        const subscription = observable.subscribe(response => {
          expect(response).not.toBePresent();
        });

        subscription.unsubscribe();

        await expect(observable.toPromise()).toBeRejected();
      });
    });
  });

  describe(".get", () => {
    const request = axios.get("http://localhost:8080/users");

    it("returns an Observable", () => {
      expect(request).toBeInstanceOf(Observable);
    });

    describe("when the observable is subscribed", () => {
      it("resolves to an axios response", async () => {
        const observable = axios.get("http://localhost:8080/users");
        observable.subscribe(response => {
          expect(response).toPartiallyMatch({
            data: [{ lastname: "Doe", name: "John" }],
            status: 200,
          });
        });

        await expect(observable.toPromise()).toBeResolved();
      });
    });

    describe("when the observable is unsubscribed", () => {
      it("cancels the request", async () => {
        const observable = axios.get("http://localhost:8080/users");
        const subscription = observable.subscribe(response => {
          expect(response).not.toBePresent();
        });

        subscription.unsubscribe();

        await expect(observable.toPromise()).toBeRejected();
      });
    });

    describe("when the data is fetched repeatedly", () => {
      it("returns the data on each rquest", async () => {
        const observable = axios
          .get<User[]>("http://localhost:8080/users")
          .pipe(
            map(({ data }) => data),
            delay(10),
            repeat(3),
          );

        observable.subscribe(users => {
          expect(users).not.toBeEmpty();
        });

        await expect(observable.toPromise()).toBeResolved();
      });
    });
  });

  describe(".delete", () => {
    const request = axios.delete("http://localhost:8080/user/1");

    it("returns an Observable", () => {
      expect(request).toBeInstanceOf(Observable);
    });

    describe("when the observable is subscribed", () => {
      it("resolves to an axios response", async () => {
        const observable = axios.delete("http://localhost:8080/user/1");

        observable.subscribe(response => {
          expect(response.status).toBeEqual(204);
        });

        await expect(observable.toPromise()).toBeResolved();
      });
    });

    describe("when the observable is unsubscribed", () => {
      it("cancels the request", async () => {
        const observable = axios.delete("http://localhost:8080/user/1");
        const subscription = observable.subscribe(response => {
          expect(response).not.toBePresent();
        });

        subscription.unsubscribe();

        await expect(observable.toPromise()).toBeRejected();
      });
    });
  });

  describe(".head", () => {
    const request = axios.head("http://localhost:8080/user/1");

    it("returns an Observable", () => {
      expect(request).toBeInstanceOf(Observable);
    });

    describe("when the observable is subscribed", () => {
      it("resolves to an axios response", async () => {
        const observable = axios.head("http://localhost:8080/user/1");

        observable.subscribe(response => {
          expect(response).toPartiallyMatch({
            data: { "Content-Type": "application/json" },
            status: 200,
          });
        });

        await expect(observable.toPromise()).toBeResolved();
      });
    });

    describe("when the observable is unsubscribed", () => {
      it("cancels the request", async () => {
        const observable = axios.head("http://localhost:8080/user/1");
        const subscription = observable.subscribe(response => {
          expect(response).not.toBePresent();
        });

        subscription.unsubscribe();

        await expect(observable.toPromise()).toBeRejected();
      });
    });
  });

  describe(".options", () => {
    it("returns an Observable", () => {
      const request = axios.options("http://localhost:8080");
      expect(request).toBeInstanceOf(Observable);
    });

    describe("when the observable is subscribed", () => {
      it("resolves to an axios response", async () => {
        const observable = axios.options("http://localhost:8080");

        observable.subscribe(response => {
          expect(response.headers).toPartiallyMatch({
            allow: "GET, HEAD, POST, OPTIONS",
          });
          expect(response.status).toBeEqual(204);
        });

        await expect(observable.toPromise()).toBeResolved();
      });
    });

    describe("when the observable is unsubscribed", () => {
      it("cancels the request", async () => {
        const observable = axios.options("http://localhost:8080");
        const subscription = observable.subscribe(response => {
          expect(response).not.toBePresent();
        });

        subscription.unsubscribe();

        await expect(observable.toPromise()).toBeRejected();
      });
    });
  });

  describe(".post", () => {
    const user = { lastname: "bar", name: "foo" };
    const request = axios.post("http://localhost:8080/users", user);

    it("returns an Observable", () => {
      expect(request).toBeInstanceOf(Observable);
    });

    describe("when the observable is subscribed", () => {
      it("resolves to an axios response", async () => {
        const observable = axios.post("http://localhost:8080/users", user);

        observable.subscribe(response => {
          expect(response).toPartiallyMatch({
            data: { id: 2, ...user },
            status: 200,
          });
        });

        await expect(observable.toPromise()).toBeResolved();
      });
    });

    describe("when the observable is unsubscribed", () => {
      it("cancels the request", async () => {
        const observable = axios.post("http://localhost:8080/users", user);
        const subscription = observable.subscribe(response => {
          expect(response).not.toBePresent();
        });

        subscription.unsubscribe();

        await expect(observable.toPromise()).toBeRejected();
      });
    });
  });

  describe(".put", () => {
    const user = { lastname: "bar", name: "foo" };
    const request = axios.put("http://localhost:8080/user/2", user);

    it("returns an Observable", () => {
      expect(request).toBeInstanceOf(Observable);
    });

    describe("when the observable is subscribed", () => {
      it("resolves to an axios response", async () => {
        const observable = axios.put("http://localhost:8080/user/2", user);

        observable.subscribe(response => {
          expect(response).toPartiallyMatch({
            data: { id: 2, ...user },
            status: 200,
          });
        });

        await expect(observable.toPromise()).toBeResolved();
      });
    });

    describe("when the observable is unsubscribed", () => {
      it("cancels the request", async () => {
        const observable = axios.put("http://localhost:8080/user/2", user);
        const subscription = observable.subscribe(response => {
          expect(response).not.toBePresent();
        });

        subscription.unsubscribe();

        await expect(observable.toPromise()).toBeRejected();
      });
    });
  });

  describe(".patch", () => {
    const partialUser = { lastname: "Jhonson" };
    const request = axios.patch("http://localhost:8080/user/1", partialUser);

    it("returns an Observable", () => {
      expect(request).toBeInstanceOf(Observable);
    });

    describe("when the observable is subscribed", () => {
      it("resolves to an axios response", async () => {
        const observable = axios.patch("http://localhost:8080/user/1", partialUser);
        observable.subscribe(response => {
          expect(response).toPartiallyMatch({
            data: { id: 1, name: "John", ...partialUser },
            status: 200,
          });
        });

        await expect(observable.toPromise()).toBeResolved();
      });
    });

    describe("when the observable is unsubscribed", () => {
      it("cancels the request", async () => {
        const observable = axios.patch("http://localhost:8080/user/1", partialUser);
        const subscription = observable.subscribe(response => {
          expect(response).not.toBePresent();
        });

        subscription.unsubscribe();

        await expect(observable.toPromise()).toBeRejected();
      });
    });
  });

  describe(".postForm", () => {
    const data = { x: "foo", y: "bar" };
    const headers = { "content-type": "application/x-www-form-urlencoded" };
    const request = axios.postForm("http://localhost:8080/form", data, { headers });

    it("returns an Observable", () => {
      expect(request).toBeInstanceOf(Observable);
    });

    describe("when the observable is subscribed", () => {
      it("resolves to an axios response", async () => {
        const observable = axios.postForm("http://localhost:8080/form", data, { headers });
        observable.subscribe(response => {
          expect(response.data)
            .asType(TypeFactories.String)
            .toContain('Content-Disposition: form-data; name="x"')
            .toContain('Content-Disposition: form-data; name="y"');
          expect(response.status).toBeEqual(200);
        });

        await expect(observable.toPromise()).toBeResolved();
      });
    });

    describe("when the observable is unsubscribed", () => {
      it("cancels the request", async () => {
        const observable = axios.postForm("http://localhost:8080/form", data, { headers });
        const subscription = observable.subscribe(response => {
          expect(response).not.toBePresent();
        });

        subscription.unsubscribe();

        await expect(observable.toPromise()).toBeRejected();
      });
    });
  });

  describe(".putForm", () => {
    const data = { x: "foo", y: "bar" };
    const headers = { "content-type": "application/x-www-form-urlencoded" };
    const request = axios.putForm("http://localhost:8080/form", data, { headers });

    it("returns an Observable", () => {
      expect(request).toBeInstanceOf(Observable);
    });

    describe("when the observable is subscribed", () => {
      it("resolves to an axios response", async () => {
        const observable = axios.putForm("http://localhost:8080/form", data, { headers });
        observable.subscribe(response => {
          expect(response.data)
            .asType(TypeFactories.String)
            .toContain('Content-Disposition: form-data; name="x"')
            .toContain('Content-Disposition: form-data; name="y"');
          expect(response.status).toBeEqual(200);
        });

        await expect(observable.toPromise()).toBeResolved();
      });
    });

    describe("when the observable is unsubscribed", () => {
      it("cancels the request", async () => {
        const observable = axios.putForm("http://localhost:8080/form", data, { headers });
        const subscription = observable.subscribe(response => {
          expect(response).not.toBePresent();
        });

        subscription.unsubscribe();

        await expect(observable.toPromise()).toBeRejected();
      });
    });
  });

  describe(".patchForm", () => {
    const data = { x: "foo", y: "bar" };
    const headers = { "content-type": "application/x-www-form-urlencoded" };
    const request = axios.patchForm("http://localhost:8080/form", data, { headers });

    it("returns an Observable", () => {
      expect(request).toBeInstanceOf(Observable);
    });

    describe("when the observable is subscribed", () => {
      it("resolves to an axios response", async () => {
        const observable = axios.patchForm("http://localhost:8080/form", data, { headers });
        observable.subscribe(response => {
          expect(response.data)
            .asType(TypeFactories.String)
            .toContain('Content-Disposition: form-data; name="x"')
            .toContain('Content-Disposition: form-data; name="y"');
          expect(response.status).toBeEqual(200);
        });

        await expect(observable.toPromise()).toBeResolved();
      });
    });

    describe("when the observable is unsubscribed", () => {
      it("cancels the request", async () => {
        const observable = axios.patchForm("http://localhost:8080/form", data, { headers });
        const subscription = observable.subscribe(response => {
          expect(response).not.toBePresent();
        });

        subscription.unsubscribe();

        await expect(observable.toPromise()).toBeRejected();
      });
    });
  });
});
