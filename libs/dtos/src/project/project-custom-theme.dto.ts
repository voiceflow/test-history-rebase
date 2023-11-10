import { z } from 'zod';

export const ProjectCustomThemePaletteDTO = z
  .object({
    50: z.string(),
    100: z.string(),
    200: z.string(),
    300: z.string(),
    400: z.string(),
    500: z.string(),
    600: z.string(),
    700: z.string(),
    800: z.string(),
    900: z.string(),
  })
  .strict();

export type ProjectCustomThemePalette = z.infer<typeof ProjectCustomThemePaletteDTO>;

export const ProjectCustomThemeDTO = z
  .object({
    name: z.string().optional(),
    palette: ProjectCustomThemePaletteDTO,
    standardColor: z.string(),
  })
  .strict();

export type ProjectCustomTheme = z.infer<typeof ProjectCustomThemeDTO>;
