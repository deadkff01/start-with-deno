import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { v1 } from "https://deno.land/std/uuid/mod.ts";

const router = new Router();

type User = {
  id: string | number[];
  name: string;
};

// generate in memory fata
const users: User[] = [];
users.push({ id: v1.generate(), name: "some name" });
users.push({ id: v1.generate(), name: "test name" });
users.push({ id: v1.generate(), name: "name test" });

router.get("/", (ctx: any) => {
  ctx.response.body = "Hello Deno!";
});

// create some user by name
router.post("/user", async (ctx: any) => {
  try {
    const { value } = await ctx.request.body();
    const { name } = value;
    if (!name) {
      ctx.response.status = 400;
      ctx.response.body = "Error when creating the user";
      return;
    }
    const newUser = { id: v1.generate(), name };
    users.push(newUser);
    ctx.response.status = 201;
    ctx.response.body = newUser;
  } catch (e) {
    console.log(e);
    ctx.response.status = 500;
    ctx.response.body = e;
  }
});

// delete user by id
router.delete("/user/:id", async (ctx: any) => {
  try {
    const { id } = ctx.params;
    const userIndex = users.findIndex((u) => u.id === id);
    if (userIndex >= 0) {
      users.splice(userIndex, 1);
      ctx.response.status = 204;
      return;
    }
    ctx.response.status = 404;
    ctx.response.body = `User with id ${id} does not exist`;
  } catch (e) {
    console.log(e);
    ctx.response.status = 500;
    ctx.response.body = e;
  }
});

// get user byd id
router.get("/user/:id", (ctx: any) => {
  try {
    const { id } = ctx.params;
    const user = users.find((u) => u.id === id);
    if (user) {
      ctx.response.status = 200;
      ctx.response.body = user;
      return;
    }
    ctx.response.status = 404;
    ctx.response.body = `User with id ${id} does not exist`;
  } catch (e) {
    console.log(e);
    ctx.response.status = 500;
    ctx.response.body = e;
  }
});

// get all users
router.get("/users", (ctx: any) => {
  ctx.response.body = users;
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());
console.log("Server is runing on: http://localhost:8000");

await app.listen({ port: 8000 });
