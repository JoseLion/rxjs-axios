import { rest } from "msw";

interface User {
  id?: number;
  lastname: string;
  name: string;
}

export const handlers = [
  rest.get("http://localhost:8080/users", (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json<User[]>([{ lastname: "Doe", name: "John" }]),
    );
  }),
  rest.delete("http://localhost:8080/user/1", (_req, res, ctx) => {
    return res(ctx.status(204));
  }),
  rest.head("http://localhost:8080/user/1", (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ "Content-Type": "application/json" }),
    );
  }),
  rest.options("http://localhost:8080", (_req, res, ctx) => {
    return res(
      ctx.status(204),
      ctx.set("Allow", "GET, HEAD, POST, OPTIONS"),
    );
  }),
  rest.post("http://localhost:8080/users", async (req, res, ctx) => {
    const body = await req.json<User>();

    return res(
      ctx.status(200),
      ctx.json<User>({ id: 2, ...body }),
    );
  }),
  rest.put("http://localhost:8080/user/2", async (req, res, ctx) => {
    const body = await req.json<User>();

    return res(
      ctx.status(200),
      ctx.json<User>({ id: 2, ...body }),
    );
  }),
  rest.patch("http://localhost:8080/user/1", async (req, res, ctx) => {
    const body = await req.json<Partial<User>>();

    return res(
      ctx.status(200),
      ctx.json<User>({ id: 1, lastname: "Doe", name: "John", ...body }),
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
