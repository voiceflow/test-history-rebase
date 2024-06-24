import { z } from 'zod';

class EnvClient {
  private schema = z
    .object({
      NODE_ENV: z.string(),
      AUTH_API_ENDPOINT: z.string(),
      ADMIN_API_ENDPOINT: z.string(),
      IDENTITY_API_ENDPOINT: z.string(),
      HASHED_WORKSPACE_ID_SALT: z.string(),
    })
    .strip();

  private env: z.infer<typeof this.schema>;

  constructor() {
    this.env = this.schema.parse(process.env);
  }

  public get<Key extends keyof z.infer<typeof this.schema>>(name: Key): z.infer<typeof this.schema>[Key] {
    return this.env[name];
  }
}

export const envClient = new EnvClient();
