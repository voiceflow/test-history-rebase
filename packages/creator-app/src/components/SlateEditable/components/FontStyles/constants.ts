export enum Font {
  OPEN_SANS = 'Open Sans',
  ARIAL = 'Arial',
  ARIAL_BLACK = 'Arial Black',
  TREBUCHET_MS = 'Trebuchet MS',
  VERDANA = 'Verdana',
  GEORGIA = 'Georgia',
  COURIER_NEW = 'Courier New',
}

export enum FontWeight {
  REGULAR = '400',
  BOLD = '700',
}

export const FONTS_LABELS: Record<string, string> = {
  [Font.OPEN_SANS]: 'Open Sans',
  [Font.ARIAL]: 'Arial',
  [Font.ARIAL_BLACK]: 'Arial Black',
  [Font.TREBUCHET_MS]: 'Trebuchet MS',
  [Font.VERDANA]: 'Verdana',
  [Font.GEORGIA]: 'Georgia',
  [Font.COURIER_NEW]: 'Courier New',
};

export const FONT_WEIGHTS_LABELS: Record<string, string> = {
  [FontWeight.REGULAR]: 'Regular',
  [FontWeight.BOLD]: 'Bold',
};

export const FONT_WEIGHTS_PER_FONT_FAMILY: Record<string, string[]> = {
  [Font.OPEN_SANS]: [FontWeight.REGULAR, FontWeight.BOLD],
  [Font.ARIAL]: [FontWeight.REGULAR, FontWeight.BOLD],
  [Font.ARIAL_BLACK]: [FontWeight.REGULAR],
  [Font.TREBUCHET_MS]: [FontWeight.REGULAR, FontWeight.BOLD],
  [Font.VERDANA]: [FontWeight.REGULAR, FontWeight.BOLD],
  [Font.GEORGIA]: [FontWeight.REGULAR, FontWeight.BOLD],
  [Font.COURIER_NEW]: [FontWeight.REGULAR, FontWeight.BOLD],
};
