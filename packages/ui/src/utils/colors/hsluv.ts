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

const lchToRgb = (tuple: lch): rgb => hyxToRgb(luvToXyz(lchToLuv(tuple)));
const hsluvToRgb = (tuple: hsl): rgb => lchToRgb(hsluvToLch(tuple));
const hsluvToHex = (tuple: hsl): string => rgbToHex(hsluvToRgb(tuple));

// eslint-disable-next-line import/prefer-default-export
export { hsluvToHex };
