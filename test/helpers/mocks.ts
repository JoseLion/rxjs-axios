import { rest } from "msw";

export const handlers = [
  rest.get("http://localhost:8080/users", (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([{ name: "John", lastname: "Doe" }]),
    );
  }),
  rest.delete("http://localhost:8080/user/1", (_req, res, ctx) => {
    return res(ctx.status(204));
  }),
  rest.head("http://localhost:8080/user/1", (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ ["Content-Type"]: "application/json" }),
    );
  }),
  rest.options("http://localhost:8080", (_req, res, ctx) => {
    return res(
      ctx.status(204),
      ctx.set("Allow", "GET, HEAD, POST, OPTIONS"),
    );
  }),
  rest.post("http://localhost:8080/users", async (req, res, ctx) => {
    const body = await req.json();

    return res(
      ctx.status(200),
      ctx.json({ id: 2, ...body }),
    );
  }),
  rest.put("http://localhost:8080/user/2", async (req, res, ctx) => {
    const body = await req.json();

    return res(
      ctx.status(200),
      ctx.json({ id: 2, ...body }),
    );
  }),
  rest.patch("http://localhost:8080/user/1", async (req, res, ctx) => {
    const body = await req.json();

    return res(
      ctx.status(200),
      ctx.json({ id: 1, name: "John", lastName: "Doe", ...body }),
    );
  }),
  rest.post("http://localhost:8080/form", async (req, res, ctx) => {
    const body = await req.text();

    return res(
      ctx.status(200),
      ctx.text(body),
    );
  }),
  rest.put("http://localhost:8080/form", async (req, res, ctx) => {
    const body = await req.text();

    return res(
      ctx.status(200),
      ctx.text(body),
    );
  }),
  rest.patch("http://localhost:8080/form", async (req, res, ctx) => {
    const body = await req.text();

    return res(
      ctx.status(200),
      ctx.text(body),
    );
  }),
];
