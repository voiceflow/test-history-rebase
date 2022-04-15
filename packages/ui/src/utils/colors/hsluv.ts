/* eslint-disable prefer-exponentiation-operator */
/* eslint-disable no-restricted-properties */
/*
  Adapted from this implementation of the HSLUV algorithm: https://github.com/StoneCypher/hsluv.ts
  🚨 This file shouldn't require any adjustments, save for eventual bugfixing, since all our actual (HSL -> HEX) and color logic is abstracted in the utils/hsl.ts file.
*/

interface line {
  slope: number;
  intercept: number;
}
type angle = number;
type rgb = [number, number, number];
type lch = [number, number, number];
type luv = [number, number, number];
type hsl = [number, number, number];
type xyz = [number, number, number];

const lengthOfArrayUntilIntersect = (utheta: angle, uline: line): number => uline.intercept / (Math.sin(utheta) - uline.slope * Math.cos(utheta));
const m = [
  [3.240969941904521, -1.537383177570093, -0.498610760293],
  [-0.96924363628087, 1.87596750150772, 0.041555057407175],
  [0.055630079696993, -0.20397695888897, 1.056971514242878],
];
const minv = [
  [0.41239079926595, 0.35758433938387, 0.18048078840183],
  [0.21263900587151, 0.71516867876775, 0.072192315360733],
  [0.019330818715591, 0.11919477979462, 0.95053215224966],
];

const refY = 1.0;
const refU = 0.19783000664283;
const refV = 0.46831999493879;

const kappa = 903.2962962;
const epsilon = 0.0088564516;
const numbers = '0123456789';
const hexChars = `${numbers}abcdef`;

const getBounds = (L: number): line[] => {
  const result: line[] = [];

  const sub1: number = (L + 16) ** 3 / 1560896;
  const sub2: number = sub1 > epsilon ? sub1 : L / kappa;

  [0, 1, 2].forEach((c) => {
    const m1: number = m[c][0];
    const m2: number = m[c][1];
    const m3: number = m[c][2];

    [0, 1, 2].forEach((t) => {
      const top1: number = (284517 * m1 - 94839 * m3) * sub2;
      const top2: number = (838422 * m3 + 769860 * m2 + 731718 * m1) * L * sub2 - 769860 * t * L;
      const bottom: number = (632260 * m3 - 126452 * m2) * sub2 + 126452 * t;

      result.push({
        slope: top1 / bottom,
        intercept: top2 / bottom,
      });
    });
  });

  return result;
};

const maxChromaForLH = (L: number, H: number): number => {
  const hrad: number = (H / 360) * Math.PI * 2;
  const bounds: line[] = getBounds(L);

  let min: number = Number.POSITIVE_INFINITY;

  bounds.forEach((bound) => {
    const length: number = lengthOfArrayUntilIntersect(hrad, bound);
    if (length >= 0) {
      min = Math.min(min, length);
    }
  });

  return min;
};

const dotProduct = (a: number[], b: number[]): number => a.reduce((acc, cur, i) => acc + cur * b[i], 0);
const fromLinear = (c: number): number => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const hyxToRgb = (tuple: xyz): rgb => [fromLinear(dotProduct(m[0], tuple)), fromLinear(dotProduct(m[1], tuple)), fromLinear(dotProduct(m[2], tuple))];
const lToY = (L: number): number => (L <= 8 ? (refY * L) / kappa : refY * ((L + 16) / 116) ** 3);
const yToL = (Y: number): number => (Y <= epsilon ? (Y / refY) * kappa : 116 * Math.pow(Y / refY, 1.0 / 3.0) - 16);
const toLinear = (c: number): number => (c > 0.04045 ? Math.pow((c + 0.055) / (1 + 0.055), 2.4) : c / 12.92);

const luvToXyz = (tuple: luv): xyz => {
  const L: number = tuple[0];
  const U: number = tuple[1];
  const V: number = tuple[2];

  if (L === 0) {
    return [0, 0, 0];
  }

  const varU: number = U / (13 * L) + refU;
  const varV: number = V / (13 * L) + refV;

  const Y: number = lToY(L);
  const X: number = 0 - (9 * Y * varU) / ((varU - 4) * varV - varU * varV);
  const Z: number = (9 * Y - 15 * varV * Y - varV * X) / (3 * varV);

  return [X, Y, Z];
};

const lchToLuv = (tuple: lch): luv => {
  const L: number = tuple[0];
  const C: number = tuple[1];
  const H: number = tuple[2];

  const Hrad: number = (H / 360.0) * 2 * Math.PI;
  const U: number = Math.cos(Hrad) * C;
  const V: number = Math.sin(Hrad) * C;

  return [L, U, V];
};

const hsluvToLch = (tuple: hsl): lch => {
  const H: number = tuple[0];
  const S: number = tuple[1];
  const L: number = tuple[2];

  if (L > 99.9999999) {
    return [100, 0, H];
  }
  if (L < 0.00000001) {
    return [0, 0, H];
  }

  const max: number = maxChromaForLH(L, H);
  const C: number = (max / 100) * S;

  return [L, C, H];
};

const rgbToHex = (tuple: rgb): string => {
  let h = '#';

  [0, 1, 2].forEach((i) => {
    const chan: number = tuple[i];
    const c: number = Math.round(chan * 255);
    const digit2: number = c % 16;
    const digit1: number = Math.floor((c - digit2) / 16);

    h += hexChars.charAt(digit1) + hexChars.charAt(digit2);
  });

  return h;
};

const hexToRgb = (uhex: string): rgb => {
  const hex: string = uhex.toLowerCase();

  const ret: rgb = [0, 0, 0];

  [0, 1, 2].forEach((i) => {
    const digit1 = hexChars.indexOf(hex.charAt(i * 2 + 1));
    const digit2 = hexChars.indexOf(hex.charAt(i * 2 + 2));
    const n = digit1 * 16 + digit2;

    ret[i] = n / 255.0;
  });

  return ret;
};

const lchToHsluv = (tuple: lch): hsl => {
  // TODO match
  const L: number = tuple[0];
  const C: number = tuple[1];
  const H: number = tuple[2];

  // White and black: disambiguate chroma
  if (L > 99.9999999) {
    return [H, 0, 100];
  }
  if (L < 0.00000001) {
    return [H, 0, 0];
  }

  const max: number = maxChromaForLH(L, H);
  const S: number = (C / max) * 100;

  return [H, S, L];
};

const luvToLch = (tuple: luv): lch => {
  const L: number = tuple[0];
  const U: number = tuple[1];
  const V: number = tuple[2];

  const C: number = Math.sqrt(U * U + V * V);

  let H: number;

  // Greys: disambiguate hue
  if (C < 0.00000001) {
    H = 0;
  } else {
    const Hrad: number = Math.atan2(V, U);
    H = (Hrad * 180.0) / Math.PI;

    if (H < 0) {
      H = 360 + H;
    }
  }

  return [L, C, H];
};

const xyzToLuv = (tuple: xyz): luv => {
  const X: number = tuple[0];
  const Y: number = tuple[1];
  const Z: number = tuple[2];

  // This divider fix avoids a crash on Python (divide by zero except.)
  // TODO FIXME this nan handling is nonsense
  const divider: number = X + 15 * Y + 3 * Z;
  const varU: number = divider === 0 ? NaN : (4 * X) / divider;
  const varV: number = divider === 0 ? NaN : (9 * Y) / divider;

  const L: number = yToL(Y);

  if (L === 0) {
    return [0, 0, 0];
  }

  const U: number = 13 * L * (varU - refU);
  const V: number = 13 * L * (varV - refV);

  return [L, U, V];
};

const rgbToXyz = (tuple: rgb): xyz => {
  const rgbl: rgb = [toLinear(tuple[0]), toLinear(tuple[1]), toLinear(tuple[2])];

  return [dotProduct(minv[0], rgbl), dotProduct(minv[1], rgbl), dotProduct(minv[2], rgbl)];
};

const lchToRgb = (tuple: lch): rgb => hyxToRgb(luvToXyz(lchToLuv(tuple)));
const hsluvToRgb = (tuple: hsl): rgb => lchToRgb(hsluvToLch(tuple));
const hsluvToHex = (tuple: hsl): string => rgbToHex(hsluvToRgb(tuple));
const hexToHsluv = (s: string): hsl => rgbToHsluv(hexToRgb(s));
const rgbToLch = (tuple: rgb): lch => luvToLch(xyzToLuv(rgbToXyz(tuple)));
const rgbToHsluv = (tuple: rgb): hsl => lchToHsluv(rgbToLch(tuple));

export { hexToHsluv, hsluvToHex };
