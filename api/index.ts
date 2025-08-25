import app from "../src/app";   // adjust path if your app.ts is in src/
import serverless from "serverless-http";

export default serverless(app);
