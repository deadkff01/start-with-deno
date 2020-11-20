import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

const env = config();

const router = new Router();

router.get("/", (ctx: any) => {
  ctx.response.body = "Hello League!";
});

// create some user by name
router.post("/player", async (ctx: any) => {
  try {
    const { value } = await ctx.request.body();
    const { name } = value;
    if (!name) {
      ctx.response.status = 400;
      ctx.response.body = "User not found";
      return;
    }
    console.log(`${env.RIOT_ENDPOINT}/${name}`);
    const url = new URL(`${env.RIOT_ENDPOINT}/${name}`);

    const response = await fetch(url, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Riot-Token": env.RIOT_TOKEN,
      }),
    });

    const body = await response.json();

    ctx.response.status = 200;
    ctx.response.body = body;
  } catch (e) {
    console.log(e);
    ctx.response.status = 404;
    ctx.response.body = e;
  }
});

const app = new Application();
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());
console.log("Server is runing on: http://localhost:3333");

await app.listen({ port: 3333 });
