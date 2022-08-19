import { v2 } from "cloudinary";
import { env } from "../server/env.mjs";

v2.config({
  cloud_name: env.CLOUD_NAME,
  api_key: env.CLOUD_API_KEY,
  api_secret: env.CLOUD_API_SECRET,
  secure: true,
});

export default v2
