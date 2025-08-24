import app from "../app"; // adjust path based on your structure
import { IncomingMessage, ServerResponse } from "http";

// Vercel expects a default export handler(req, res)
export default function handler(req: IncomingMessage, res: ServerResponse) {
  return app(req, res);
}
