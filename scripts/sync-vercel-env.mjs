import { execSync } from "child_process";
import { readFileSync } from "fs";

function parseEnv(content) {
  const out = {};
  for (const line of content.split(/\r?\n/)) {
    if (!line || line.startsWith("#")) continue;
    const i = line.indexOf("=");
    if (i < 0) continue;
    const key = line.slice(0, i).trim();
    let val = line.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

const env = parseEnv(readFileSync(".env", "utf8"));
const all = {
  ...env,
  NEXT_PUBLIC_BRAND: "passmaster",
  NEXT_PUBLIC_SITE_URL: "https://passmaster3-sanahai71-2046s-projects.vercel.app",
  CRON_SECRET: env.AUTH_SECRET,
};

const skip = new Set(["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]);
const targets = ["production", "preview", "development"];

for (const [name, value] of Object.entries(all)) {
  if (!value || skip.has(name)) continue;
  const sensitive = /SECRET|URL|DATABASE|DIRECT|KEY/i.test(name);
  for (const target of targets) {
    const args = ["env", "add", name, target, "--value", value, "--yes"];
    if (sensitive) args.push("--sensitive");
    else args.push("--no-sensitive");
    if (target !== "production") args.push("--force");
    try {
      execSync(`npx vercel ${args.map((a) => JSON.stringify(a)).join(" ")}`, {
        stdio: "inherit",
      });
    } catch {
      // already exists or transient failure
    }
  }
}

console.log("Vercel env sync complete.");
