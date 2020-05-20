export const UPDATE_DATA_TIMEOUT = 300;

export enum Font {
  ARIAL = 'Arial',
  ARIAL_BLACK = 'Arial Black',
  TREBUCHET_MS = 'Trebuchet MS',
  VERANDA = 'Veranda',
  GEORGIA = 'Georgia',
  COURIER_NEW = 'Courier New',
}

export enum FontWeight {
  REGULAR = '400',
  BOLD = '700',
}

export enum TextAlign {
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center',
}

export const FONTS_LABELS = {
  [Font.ARIAL]: 'Arial',
  [Font.ARIAL_BLACK]: 'Arial Black',
  [Font.TREBUCHET_MS]: 'Trebuchet MS',
  [Font.VERANDA]: 'Veranda',
  [Font.GEORGIA]: 'Georgia',
  [Font.COURIER_NEW]: 'Courier New',
};

export const FONT_WEIGHTS_LABELS = {
  [FontWeight.REGULAR]: 'Regular',
  [FontWeight.BOLD]: 'Bold',
};

export const FONT_WEIGHTS_PER_FONT_FAMILY = {
  [Font.ARIAL]: [FontWeight.REGULAR, FontWeight.BOLD],
  [Font.ARIAL_BLACK]: [FontWeight.REGULAR],
  [Font.TREBUCHET_MS]: [FontWeight.REGULAR, FontWeight.BOLD],
  [Font.VERANDA]: [FontWeight.REGULAR, FontWeight.BOLD],
  [Font.GEORGIA]: [FontWeight.REGULAR, FontWeight.BOLD],
  [Font.COURIER_NEW]: [FontWeight.REGULAR, FontWeight.BOLD],
};
