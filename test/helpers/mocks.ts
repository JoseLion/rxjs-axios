import { HttpResponse, type PathParams, http } from "msw";

export interface User {
  id?: number;
  lastname: string;
  name: string;
}

export const handlers = [
  http.get("http://localhost:8080/users", () => {
    return HttpResponse.json<User[]>(
      [{ lastname: "Doe", name: "John" }],
      { status: 200 },
    );
  }),
  http.delete("http://localhost:8080/user/1", () => {
    return new HttpResponse(null, { status: 204 });
  }),
  http.head("http://localhost:8080/user/1", () => {
    return HttpResponse.json(
      { "Content-Type": "application/json" },
      { status: 200 },
    );
  }),
  http.options("http://localhost:8080", () => {
    return new HttpResponse(
      null,
      {
        headers: { Allow: "GET, HEAD, POST, OPTIONS" },
        status: 204,
      },
    );
  }),
  http.post<PathParams, User>("http://localhost:8080/users", async ({ request }) => {
    const body = await request.json();

    return HttpResponse.json<User>(
      { id: 2, ...body },
      { status: 200 },
    );
  }),
  http.put<PathParams, User>("http://localhost:8080/user/2", async ({ request }) => {
    const body = await request.json();

    return HttpResponse.json<User>(
      { id: 2, ...body },
      { status: 200 },
    );
  }),
  http.patch<PathParams, Partial<User>>("http://localhost:8080/user/1", async ({ request }) => {
    const body = await request.json();

    return HttpResponse.json<User>(
      { id: 1, lastname: "Doe", name: "John", ...body },
      { status: 200 },
    );
  }),
  http.post("http://localhost:8080/form", async ({ request }) => {
    const body = await request.text();

    return HttpResponse.text(body, { status: 200 });
  }),
  http.put("http://localhost:8080/form", async ({ request }) => {
    const body = await request.text();

    return HttpResponse.text(body, { status: 200 });
  }),
  http.patch("http://localhost:8080/form", async ({ request }) => {
    const body = await request.text();

    return HttpResponse.text(body, { status: 200 });
  }),
];
