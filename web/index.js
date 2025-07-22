// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import PrivacyWebhookHandlers from "./privacy.js";
import { dbConnection } from "./server/config/db.js";
import routes from "./server/routes/index.js";
import { authenticateUser } from "./server/middlewares/auth.middleware.js";
import cors from "cors";


//connecting to database
dbConnection()
const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();
const allowedOrigins = {
  development: [
    'https://siddhi-test.myshopify.com'
  ],
  production: [
    'https://siddhi-test.myshopify.com'
  ],
};
// for local development we have set up ant origins
app.use(cors({
  origin: function (origin, callback) {
    console.log("origin", origin);
    const allowed = allowedOrigins[process.env.NODE_ENV] || [];
    if (!origin || allowed.includes(origin) || origin.endsWith(".trycloudflare.com")) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-custom-preflight'],
}));
app.options('*', cors());


app.use(express.json());

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession(), authenticateUser);
app.use("/api", routes);

app.use("/external/*", authenticateUser);
app.use("/external/", routes);

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  res
    .status(200)
    .set("Content-Type", "text/html")
    .send(
      readFileSync(join(STATIC_PATH, "index.html"))
        .toString()
        .replace("%VITE_SHOPIFY_API_KEY%", process.env.SHOPIFY_API_KEY || "")
    );
});

console.log(`Server running on http://localhost:${PORT}`);
app.listen(PORT);
