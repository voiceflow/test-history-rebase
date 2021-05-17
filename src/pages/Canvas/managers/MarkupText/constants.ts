export const UPDATE_DATA_TIMEOUT = 300;
export const SLATE_EDITOR_CLASS_NAME = 'slate-editor';

export const DEFAULT_LINK_COLOR = { r: 93, g: 157, b: 245, a: 1 };
export const DEFAULT_COLOR = { r: 19, g: 33, b: 68, a: 1 };
export const FAKE_SELECTION_PROPERTY_NAME = 'fakeSelection' as const;

export enum ElementType {
  LINK = 'link',
}

export enum ElementProperty {
  TEXT_ALIGN = 'textAlign',
}

export enum TextProperty {
  COLOR = 'color',
  ITALIC = 'italic',
  UNDERLINE = 'underline',
  FONT_WEIGHT = 'fontWeight',
  FONT_FAMILY = 'fontFamily',
}

export enum TextAlign {
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center',
}

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

export const FONTS_LABELS: Record<Font, string> = {
  [Font.OPEN_SANS]: 'Open Sans',
  [Font.ARIAL]: 'Arial',
  [Font.ARIAL_BLACK]: 'Arial Black',
  [Font.TREBUCHET_MS]: 'Trebuchet MS',
  [Font.VERDANA]: 'Verdana',
  [Font.GEORGIA]: 'Georgia',
  [Font.COURIER_NEW]: 'Courier New',
};

export const FONT_WEIGHTS_LABELS = {
  [FontWeight.REGULAR]: 'Regular',
  [FontWeight.BOLD]: 'Bold',
};

export const FONT_WEIGHTS_PER_FONT_FAMILY: Record<Font, FontWeight[]> = {
  [Font.OPEN_SANS]: [FontWeight.REGULAR, FontWeight.BOLD],
  [Font.ARIAL]: [FontWeight.REGULAR, FontWeight.BOLD],
  [Font.ARIAL_BLACK]: [FontWeight.REGULAR],
  [Font.TREBUCHET_MS]: [FontWeight.REGULAR, FontWeight.BOLD],
  [Font.VERDANA]: [FontWeight.REGULAR, FontWeight.BOLD],
  [Font.GEORGIA]: [FontWeight.REGULAR, FontWeight.BOLD],
  [Font.COURIER_NEW]: [FontWeight.REGULAR, FontWeight.BOLD],
};
