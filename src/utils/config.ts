import fs from "fs";
import YAML from "yaml";
import { z } from "zod";
import { type Config } from "../types";

const yaml = (configFileName: string): Config => {
  if (!fs.existsSync(configFileName)) {
    throw new Error("Config file not found");
  }
  const file = fs.readFileSync(configFileName, "utf8");
  const snakeToCamelCase = (str: string): string =>
    str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());

  const convertKeysToCamelCase = (obj: object): object => {
    if (Array.isArray(obj)) {
      return obj.map((item) => convertKeysToCamelCase(item));
    }
    if (obj && typeof obj === "object") {
      return Object.fromEntries(
        Object.entries(obj as object).map(([key, value]) => [
          snakeToCamelCase(key),
          convertKeysToCamelCase(value),
        ]),
      );
    }
    return obj;
  };

  const config: object = YAML.parse(file);
  const validatedConfig: any = configSchema.safeParse(config);
  if (!validatedConfig.success) {
    throw new Error(`Invalid config: ${validatedConfig.error}`);
  }

  return convertKeysToCamelCase(config) as Config;
};

const configSchema = z.object({
  schedule: z.string(),
  mail: z.object({
    from_name: z.string(),
    from_email: z.string(),
    mj_template_id: z.number(),
    mj_api_key: z.string(),
    mj_api_secret: z.string(),
    bcc: z.array(z.string().email()).optional(),
  }),
  team: z.array(
    z.object({
      full_name: z.string(),
      birthdate: z.string().date(),
      email: z.string().email(),
    }),
  ),
});

export { yaml };
