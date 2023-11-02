export interface ProjectCustomTheme {
  name?: string;
  palette: Record<'50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900', string>;
  standardColor: string;
}
