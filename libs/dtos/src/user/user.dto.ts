import { z } from 'nestjs-zod/z';

export const UserDTO = z.object({
  id: z.number(),
  name: z.string(),
  email: z
    .string()
    .email()
    .transform((value) => value.toLowerCase()),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
});

export type User = z.infer<typeof UserDTO>;
