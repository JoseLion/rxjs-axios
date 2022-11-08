import { expect, TypeFactories } from "@stackbuilders/assertive-ts";
import otherAxios from "axios";
import FormData from "form-data";
import { Observable } from "rxjs";
import Sinon from "sinon";

import { axios } from "../../src";
import { RxjsAxios } from "../../src/lib/RxjsAxios";

describe("[Unit] RxjsAxios.test.ts", () => {
  describe(".of", () => {
    it("creates an RxjsAxios instance from another Axios instance", () => {
      const rxjsAxios = RxjsAxios.of(otherAxios);

      expect(Object(rxjsAxios))
        .asType(TypeFactories.object())
        .toContainEntry(["axios", otherAxios]);
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
      const spy = Sinon.spy(otherAxios, "isAxiosError");

      RxjsAxios.isAxiosError("foo");

      Sinon.assert.calledOnceWithExactly(spy, "foo");
    });
  });

  describe(".isCancel", () => {
    it("calls the same Axios method", () => {
      const spy = Sinon.spy(otherAxios, "isCancel");

      RxjsAxios.isCancel("foo");

      Sinon.assert.calledOnceWithExactly(spy, "foo");
    });
  });

  describe(".toFormData", () => {
    it("calls the same Axios method", () => {
      const spy = Sinon.spy(otherAxios, "toFormData");

      RxjsAxios.toFormData({ });

      Sinon.assert.calledOnceWithExactly(spy, { }, undefined, undefined);
    });
  });

  describe(".formToJSON", () => {
    it("calls the same Axios method", () => {
      const spy = Sinon.spy(otherAxios, "formToJSON");
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
      const rxjsAxios = RxjsAxios.of(otherAxios);

      expect(rxjsAxios.interceptors).toBeSame(otherAxios.interceptors);
    });
  });

  describe(".request", () => {
    const request = axios.request({ method: "GET", url: "http://localhost:8080/users" });

    it("returns an Observable", () => {
      expect(request).toBeInstanceOf(Observable);
    });

    context("when the observable is subscribed", () => {
      it("resolves to an axios response", done => {
        axios.request({ method: "GET", url: "http://localhost:8080/users" })
          .subscribe(response => {
            expect(response).toPartiallyMatch({
              data: [{ name: "John", lastname: "Doe" }],
              status: 200,
            });

            done();
          });
      });
    });

    context("when the observable is unsubscribed", () => {
      it("cancels the request", done => {
        const subscription = axios.request({ method: "GET", url: "http://localhost:8080/users" })
          .subscribe(response => {
            expect(response).not.toBePresent();
            done();
          });

        subscription.unsubscribe();
        done();
      });
    });
  });

  describe(".get", () => {
    const request = axios.get("http://localhost:8080/users");

    it("returns an Observable", () => {
      expect(request).toBeInstanceOf(Observable);
    });

    context("when the observable is subscribed", () => {
      it("resolves to an axios response", done => {
        axios.get("http://localhost:8080/users")
          .subscribe(response => {
            expect(response).toPartiallyMatch({
              data: [{ name: "John", lastname: "Doe" }],
              status: 200,
            });

            done();
          });
      });
    });

    context("when the observable is unsubscribed", () => {
      it("cancels the request", done => {
        const subscription = axios.get("http://localhost:8080/users")
          .subscribe(response => {
            expect(response).not.toBePresent();
            done();
          });

        subscription.unsubscribe();
        done();
      });
    });
  });

  describe(".delete", () => {
    const request = axios.delete("http://localhost:8080/user/1");

    it("returns an Observable", () => {
      expect(request).toBeInstanceOf(Observable);
    });

    context("when the observable is subscribed", () => {
      it("resolves to an axios response", done => {
        axios.delete("http://localhost:8080/user/1")
          .subscribe(response => {
            expect(response.status).toBeEqual(204);
            done();
          });
      });
    });

    context("when the observable is unsubscribed", () => {
      it("cancels the request", done => {
        const subscription = axios.delete("http://localhost:8080/user/1")
          .subscribe(response => {
            expect(response).not.toBePresent();
            done();
          });

        subscription.unsubscribe();
        done();
      });
    });
  });

  describe(".head", () => {
    const request = axios.head("http://localhost:8080/user/1");

    it("returns an Observable", () => {
      expect(request).toBeInstanceOf(Observable);
    });

    context("when the observable is subscribed", () => {
      it("resolves to an axios response", done => {
        axios.head("http://localhost:8080/user/1")
          .subscribe(response => {
            expect(response).toPartiallyMatch({
              data: { ["Content-Type"]: "application/json" },
              status: 200,
            });
            done();
          });
      });
    });

    context("when the observable is unsubscribed", () => {
      it("cancels the request", done => {
        const subscription = axios.head("http://localhost:8080/user/1")
          .subscribe(response => {
            expect(response).not.toBePresent();
            done();
          });

        subscription.unsubscribe();
        done();
      });
    });
  });

  describe(".options", () => {
    const request = axios.options("http://localhost:8080");

    it("returns an Observable", () => {
      expect(request).toBeInstanceOf(Observable);
    });

    context("when the observable is subscribed", () => {
      it("resolves to an axios response", done => {
        axios.options("http://localhost:8080")
          .subscribe(response => {
            expect(response.headers).toPartiallyMatch({
              "allow": "GET, HEAD, POST, OPTIONS",
              "x-powered-by": "msw",
            });
            expect(response.status).toBeEqual(204);
            done();
          });
      });
    });

    context("when the observable is unsubscribed", () => {
      it("cancels the request", done => {
        const subscription = axios.options("http://localhost:8080")
          .subscribe(response => {
            expect(response).not.toBePresent();
            done();
          });

        subscription.unsubscribe();
        done();
      });
    });
  });

  describe(".post", () => {
    const user = { name: "foo", lastname: "bar" };
    const request = axios.post("http://localhost:8080/users", user);

    it("returns an Observable", () => {
      expect(request).toBeInstanceOf(Observable);
    });

    context("when the observable is subscribed", () => {
      it("resolves to an axios response", done => {
        axios.post("http://localhost:8080/users", user)
          .subscribe(response => {
            expect(response).toPartiallyMatch({
              data: { id: 2, ...user },
              status: 200,
            });

            done();
          });
      });
    });

    context("when the observable is unsubscribed", () => {
      it("cancels the request", done => {
        const subscription = axios.post("http://localhost:8080/users", user)
          .subscribe(response => {
            expect(response).not.toBePresent();
            done();
          });

        subscription.unsubscribe();
        done();
      });
    });
  });

  describe(".put", () => {
    const user = { name: "foo", lastname: "bar" };
    const request = axios.put("http://localhost:8080/user/2", user);

    it("returns an Observable", () => {
      expect(request).toBeInstanceOf(Observable);
    });

    context("when the observable is subscribed", () => {
      it("resolves to an axios response", done => {
        axios.put("http://localhost:8080/user/2", user)
          .subscribe(response => {
            expect(response).toPartiallyMatch({
              data: { id: 2, ...user },
              status: 200,
            });

            done();
          });
      });
    });

    context("when the observable is unsubscribed", () => {
      it("cancels the request", done => {
        const subscription = axios.put("http://localhost:8080/user/2", user)
          .subscribe(response => {
            expect(response).not.toBePresent();
            done();
          });

        subscription.unsubscribe();
        done();
      });
    });
  });

  describe(".patch", () => {
    const partialUser = { lastname: "Jhonson" };
    const request = axios.patch("http://localhost:8080/user/1", partialUser);

    it("returns an Observable", () => {
      expect(request).toBeInstanceOf(Observable);
    });

    context("when the observable is subscribed", () => {
      it("resolves to an axios response", done => {
        axios.patch("http://localhost:8080/user/1", partialUser)
          .subscribe(response => {
            expect(response).toPartiallyMatch({
              data: { id: 1, name: "John", lastName: "Doe", ...partialUser },
              status: 200,
            });

            done();
          });
      });
    });

    context("when the observable is unsubscribed", () => {
      it("cancels the request", done => {
        const subscription = axios.patch("http://localhost:8080/user/1", partialUser)
          .subscribe(response => {
            expect(response).not.toBePresent();
            done();
          });

        subscription.unsubscribe();
        done();
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

    context("when the observable is subscribed", () => {
      it("resolves to an axios response", done => {
        axios.postForm("http://localhost:8080/form", data, { headers })
          .subscribe(response => {
            expect(response.data)
              .asType(TypeFactories.String)
              .toContain('Content-Disposition: form-data; name="x"')
              .toContain('Content-Disposition: form-data; name="y"');
            expect(response.status).toBeEqual(200);

            done();
          });
      });
    });

    context("when the observable is unsubscribed", () => {
      it("cancels the request", done => {
        const subscription = axios.postForm("http://localhost:8080/form", data, { headers })
          .subscribe(response => {
            expect(response).not.toBePresent();
            done();
          });

        subscription.unsubscribe();
        done();
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

    context("when the observable is subscribed", () => {
      it("resolves to an axios response", done => {
        axios.putForm("http://localhost:8080/form", data, { headers })
          .subscribe(response => {
            expect(response.data)
              .asType(TypeFactories.String)
              .toContain('Content-Disposition: form-data; name="x"')
              .toContain('Content-Disposition: form-data; name="y"');
            expect(response.status).toBeEqual(200);

            done();
          });
      });
    });

    context("when the observable is unsubscribed", () => {
      it("cancels the request", done => {
        const subscription = axios.putForm("http://localhost:8080/form", data, { headers })
          .subscribe(response => {
            expect(response).not.toBePresent();
            done();
          });

        subscription.unsubscribe();
        done();
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

    context("when the observable is subscribed", () => {
      it("resolves to an axios response", done => {
        axios.patchForm("http://localhost:8080/form", data, { headers })
          .subscribe(response => {
            expect(response.data)
              .asType(TypeFactories.String)
              .toContain('Content-Disposition: form-data; name="x"')
              .toContain('Content-Disposition: form-data; name="y"');
            expect(response.status).toBeEqual(200);

            done();
          });
      });
    });

    context("when the observable is unsubscribed", () => {
      it("cancels the request", done => {
        const subscription = axios.patchForm("http://localhost:8080/form", data, { headers })
          .subscribe(response => {
            expect(response).not.toBePresent();
            done();
          });

        subscription.unsubscribe();
        done();
      });
    });
  });
});
