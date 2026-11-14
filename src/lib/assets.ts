import "server-only";
import fs from "node:fs";
import path from "node:path";

/**
 * Owner-supplied assets are detected on disk at build time. Dropping the file
 * into /public makes the feature appear. No code change is needed.
 */
const exists = (rel: string) => fs.existsSync(path.join(process.cwd(), "public", rel));

import { RESUME_PATH } from "./resume-path";
export { RESUME_PATH };

export function getAssets() {
  return {
    resume: exists("resume/Uttam-Singh-Resume.pdf") ? RESUME_PATH : null,
    portrait: exists("images/personal/main-profile-pic.jpeg") ? "/images/personal/main-profile-pic.jpeg" : null,
  };
}
