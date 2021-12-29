// Adapted from https://github.com/microsoft/fluent-ui-react/blob/master/packages/react-theming/src/utilities/color.contrast.ts

const MAX_COLOR_ALPHA = 100;

/**
 * Converts a valid CSS color string to an RGB color.
 * Note that hex colors *must* be prefixed with # to be considered valid.
 * Alpha in returned color defaults to 100.
 * Four and eight digit hex values (with alpha) are supported if the current browser supports them.
 */
export function cssColor(color?: string): IRGB | undefined {
  if (!color) {
    return undefined;
  }

  // Need to check the following valid color formats: RGB(A), HSL(A), hex, named color

  // First check for well formatted RGB(A), HSL(A), and hex formats at the start.
  // This is for perf (no creating an element) and catches the intentional "transparent" color
  //   case early on.
  const easyColor: IRGB | undefined =
    _rgba(color) || _hex6(color) || _hex3(color) || _hsla(color);
  if (easyColor) {
    return easyColor;
  }

  // if the above fails, do the more expensive catch-all
  return _browserCompute(color);
}

/**
 * Uses the browser's getComputedStyle() to determine what the passed-in color is.
 * This assumes _rgba, _hex6, _hex3, and _hsla have already been tried and all failed.
 * This works by attaching an element to the DOM, which may fail in server-side rendering
 *   or with headless browsers.
 */
function _browserCompute(str: string): IRGB | undefined {
  if (typeof document === "undefined") {
    // don't throw an error when used server-side
    return undefined;
  }
  const elem = document.createElement("div");
  elem.style.backgroundColor = str;
  // This element must be attached to the DOM for getComputedStyle() to have a value
  elem.style.position = "absolute";
  elem.style.top = "-9999px";
  elem.style.left = "-9999px";
  elem.style.height = "1px";
  elem.style.width = "1px";
  document.body.appendChild(elem);
  const eComputedStyle = getComputedStyle(elem);
  const computedColor = eComputedStyle.backgroundColor;
  document.body.removeChild(elem);
  // computedColor is always an RGB(A) string, except for invalid colors in IE/Edge which return 'transparent'

  // browsers return one of these if the color string is invalid,
  // so need to differentiate between an actual error and intentionally passing in this color
  if (computedColor === "rgba(0, 0, 0, 0)" || computedColor === "transparent") {
    switch (str.trim()) {
      // RGB and HSL were already checked at the start of the function
      case "transparent":
      case "#0000":
      case "#00000000":
        return { r: 0, g: 0, b: 0, a: 0 };
    }
    return undefined;
  }

  return _rgba(computedColor);
}

/**
 * If `str` is in valid `rgb()` or `rgba()` format, returns an RGB color (alpha defaults to 100).
 * Otherwise returns undefined.
 */
function _rgba(str?: string | null): IRGB | undefined {
  if (!str) {
    return undefined;
  }

  const match = str.match(/^rgb(a?)\(([\d., ]+)\)$/);
  if (match) {
    const hasAlpha = !!match[1];
    const expectedPartCount = hasAlpha ? 4 : 3;
    const parts = match[2].split(/ *, */).map(Number);

    if (parts.length === expectedPartCount) {
      return {
        r: parts[0],
        g: parts[1],
        b: parts[2],
        a: hasAlpha ? parts[3] * 100 : MAX_COLOR_ALPHA,
      };
    }
  }
}

/**
 * Turn an rgb value into a string color value.  Either as an rgba if it has an alpha, or as a hex based
 * string
 *
 * @param r - red
 * @param g - green
 * @param b - blue
 * @param a - alpha, defaulted to 100 which is opaque
 */
function rgbToString(r: number, g: number, b: number, a: number = 100): string {
  if (a !== 100) {
    return `rgba(${r}, ${g}, ${b}, ${a / 100})`;
  }
  return `#${rgb2hex(r, g, b)}`;
}

/**
 * Take an rgb numbers and turn them into hex values such as 'ffab04'
 *
 * @param r - red value
 * @param g - green value
 * @param b - blue value
 */
export function rgb2hex(r: number, g: number, b: number): string {
  return [
    _numberToPaddedHex(r),
    _numberToPaddedHex(g),
    _numberToPaddedHex(b),
  ].join("");
}

function _numberToPaddedHex(num: number): string {
  const hex = num.toString(16);

  return hex.length === 1 ? `0${hex}` : hex;
}

/**
 * If `str` is in `hsl()` or `hsla()` format, returns an RGB color (alpha defaults to 100).
 * Otherwise returns undefined.
 */
function _hsla(str: string): IRGB | undefined {
  const match = str.match(/^hsl(a?)\(([\d., ]+)\)$/);
  if (match) {
    const hasAlpha = !!match[1];
    const expectedPartCount = hasAlpha ? 4 : 3;
    const parts = match[2].split(/ *, */).map(Number);

    if (parts.length === expectedPartCount) {
      const rgba = hsl2rgb({ h: parts[0], s: parts[1], l: parts[2] });
      rgba.a = hasAlpha ? parts[3] * 100 : MAX_COLOR_ALPHA;
      return rgba;
    }
  }
}

/**
 * If `str` is in valid 6-digit hex format *with* # prefix, returns an RGB color (with alpha 100).
 * Otherwise returns undefined.
 */
function _hex6(str: string): IRGB | undefined {
  if (str.startsWith("#") && str.length === 7 && /^#[\da-fA-F]{6}$/.test(str)) {
    return {
      r: parseInt(str.slice(1, 3), 16),
      g: parseInt(str.slice(3, 5), 16),
      b: parseInt(str.slice(5, 7), 16),
      a: MAX_COLOR_ALPHA,
    };
  }
}

/**
 * If `str` is in valid 3-digit hex format *with* # prefix, returns an RGB color (with alpha 100).
 * Otherwise returns undefined.
 */
function _hex3(str: string): IRGB | undefined {
  if (str.startsWith("#") && str.length === 4 && /^#[\da-fA-F]{3}$/.test(str)) {
    return {
      r: parseInt(str[1] + str[1], 16),
      g: parseInt(str[2] + str[2], 16),
      b: parseInt(str[3] + str[3], 16),
      a: MAX_COLOR_ALPHA,
    };
  }
}

/**
 * An rgb value, generally values range from 0 to 255
 */
interface IRGB {
  r: number;
  g: number;
  b: number;
  a?: number;
}

interface IHSL {
  /** hue, a value from 0 to 360 representing position on a color wheel */
  h: number;

  /** saturation value, ranges from 0 to 1 */
  s: number;

  /** lightness value, ranges from 0 to 1 */
  l: number;
}

/**
 * Converts an rgb value directly into an hsl
 *
 * @param rgb - rgb value to convert to hsl.  Note that s/l have ranges from 0 to 1
 */
export function rgb2hsl(rgb: IRGB): IHSL {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  // Calculate hue
  let h: number = 0;
  if (delta === 0) {
    h = 0;
  } else if (r === max) {
    h = ((g - b) / delta) % 6;
  } else if (g === max) {
    h = (b - r) / delta + 2;
  } else if (b === max) {
    h = (r - g) / delta + 4;
  }

  h *= 60;

  // hue is a wheel -- adjust for negatives
  if (h < 0) {
    h += 360;
  }

  // Calculate lightness
  const l: number = (max + min) / 2;

  // Calculate saturation
  let s: number = 0;
  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
  }

  return { h, s, l };
}

/**
 * Given an IHSl will generate an IRGB with filled in r g and b
 *
 * @param hsl - hsl an IHSL with s and l being values from 0 to 1
 */
export function hsl2rgb(hsl: IHSL): IRGB {
  const c: number = (1 - Math.abs(2 * hsl.l - 1)) * hsl.s;
  const x: number = c * (1 - Math.abs(((hsl.h / 60) % 2) - 1));
  const m: number = hsl.l - c / 2;

  let r1: number = 0;
  let g1: number = 0;
  let b1: number = 0;

  // different values of h
  if (hsl.h < 60) {
    r1 = c;
    g1 = x;
    b1 = 0;
  } else if (hsl.h < 120) {
    r1 = x;
    g1 = c;
    b1 = 0;
  } else if (hsl.h < 180) {
    r1 = 0;
    g1 = c;
    b1 = x;
  } else if (hsl.h < 240) {
    r1 = 0;
    g1 = x;
    b1 = c;
  } else if (hsl.h < 300) {
    r1 = x;
    g1 = 0;
    b1 = c;
  } else {
    r1 = c;
    g1 = 0;
    b1 = x;
  }

  return {
    r: Math.round(255 * (r1 + m)),
    g: Math.round(255 * (g1 + m)),
    b: Math.round(255 * (b1 + m)),
  };
}

export type RequiredContrast = "minimal" | "low" | "medium" | "high";

const contrastDefaults: { [K in RequiredContrast]: number } = {
  minimal: 1.5,
  low: 3.0,
  medium: 4.5,
  high: 6.0,
};

/**
 * internal interface for caching contrast adjusted values.
 */
interface IContrastCache {
  [bgColor: string]:
    | {
        [fgColor: string]: { [K in RequiredContrast]?: string } | undefined;
      }
    | undefined;
}

/**
 * An ISuggestionRange is an interface internal to the utilities in this file
 * It is primarily used to denote an acceptable range of relative luminance values
 */
interface ISuggestionRange {
  min: number;
  max: number;
}

/**
 * internal cache object
 */
const contrastCache: IContrastCache = {
  rgbLookup: {},
  cache: {},
};

/**
 * Take two strings representing a foreground and background color and potentially return a new foreground
 * color value which has an acceptable level of contrast with the background.  Because this can be expensive
 * it has an internal cache.
 * @param color - foreground color to potentially adjust for contrast
 * @param backgroundColor - background color to that the color needs to be shown on
 * @param desiredRatio - desired contrast ratio, defaults to 4.5
 */
export default function getContrastingColor(
  color: string,
  backgroundColor: string,
  requiredContrast: RequiredContrast = "medium"
): string {
  const desiredRatio = contrastDefaults[requiredContrast];

  const colorKey = JSON.stringify(color);
  const backgroundColorKey = JSON.stringify(color);

  /* eslint-disable no-multi-assign */
  const bgEntry = (contrastCache[backgroundColorKey] =
    contrastCache[backgroundColorKey] || {});
  const fgEntry = (bgEntry[colorKey] = bgEntry[colorKey] || {});

  if (!fgEntry[requiredContrast]) {
    const fg = cssColor(color);
    const newFg = adjustForContrast(
      fg!,
      cssColor(backgroundColor)!,
      desiredRatio
    );
    fgEntry[requiredContrast] = rgbToString(newFg.r, newFg.g, newFg.b);
  }

  return fgEntry[requiredContrast]!;
}

/**
 * If possible, this will return a valid color to use to contrast against a background
 * The returned color attempts to maintain the chromaticity of the baseline color
 * If the desired ratio is unachievable white or black (dependent on target's relative luminance)
 * will be used
 *
 * @param textColor - a color value serving as a baseline for the tone (hue and saturation) to maintain
 * @param backgroundColor - the target to contrast against
 * @param desiredRatio - a desired contrast ratio (default is WCAG 2 AA standard for normal text)
 */
function adjustForContrast(
  baseline: IRGB,
  target: IRGB,
  desiredRatio: number = 4.5
): IRGB {
  const desiredRelLuminance: ISuggestionRange = getContrastingLuminanceRange(
    target,
    desiredRatio
  );

  // default to black or white
  if (desiredRelLuminance.min === -1) {
    // go to black
    return { r: 0, g: 0, b: 0 };
  }
  if (desiredRelLuminance.min === 2) {
    // go to white
    return { r: 255, g: 255, b: 255 };
  }

  return contrastAdjust(baseline, desiredRelLuminance);
}

/**
 * TODO: There are some very interesting alternatives that can be explored
 *    Transforms into XYZ and LAB color spaces prior to scaling across a single dimension
 *    The problem is LAB is a larger color space and the projected values may not actually
 *    match desired relative luminance (still might be worth exploring)
 * TODO: If IColor is THE color interface we would like people to use, this should return it
 *
 * This is the core contrast adjusting algorithm
 * It will take an IRGB and return a transformed version
 * The new version will fall in the suggested relative luminance range
 * But will maintain the same tone (hue and saturation in this case)
 * It does so by transforming to an IHSL and searching across L values for a proper relative luminance
 *
 * @param color - a baseline color of which the returned color will maintain its hue and saturation
 * @param suggestedRelLuminance - a luminance range to use
 */
function contrastAdjust(
  color: IRGB,
  suggestedRelLuminance: ISuggestionRange
): IRGB {
  // it is possible that the current color meets the suggested relative luminance
  let currRelLuminance: number = relativeLuminance(color.r, color.g, color.b);
  if (
    currRelLuminance >= suggestedRelLuminance.min &&
    currRelLuminance <= suggestedRelLuminance.max
  ) {
    return { r: color.r, g: color.g, b: color.b }; // make a copy to be safe
  }

  const hsl: IHSL = rgb2hsl(color);

  // allow for a .01 (totally arbitrary) error bound, also a good cutting off point
  // the error bound is safe as it will eventually result in an overcautios contrast ratio
  // and cap from 0 to 1 as relative luminance is normalized against that range
  const desiredMin: number = Math.max(suggestedRelLuminance.min - 0.01, 0);
  const desiredMax: number = Math.min(suggestedRelLuminance.max + 0.01, 1);

  // binary search across l values
  let minL: number = currRelLuminance < desiredMin ? hsl.l : 0;
  let maxL: number = currRelLuminance > desiredMax ? hsl.l : 1;
  let rgbFinal: IRGB = { r: 0, g: 0, b: 0 }; // default to black

  while (currRelLuminance < desiredMin || currRelLuminance > desiredMax) {
    hsl.l = (maxL + minL) / 2;
    rgbFinal = hsl2rgb(hsl);
    currRelLuminance = relativeLuminance(rgbFinal.r, rgbFinal.g, rgbFinal.b);
    if (currRelLuminance > desiredMax) {
      maxL = (maxL + minL) / 2;
    } else if (currRelLuminance < desiredMin) {
      minL = (maxL + minL) / 2;
    }
  }

  return rgbFinal;
}

/**
 * TODO: There are cases where the desired ratios can be achieved by going either lighter or darker
 *   It may be cool and not too much work to add an additional argument allowing consumers to choose
 *   get lighter or darker if that choice is there to be made
 *
 * Returns a suggested relative luminance range given a constant color
 * Note that it is possible that the desired ratio is unachievable
 * In these cases this function will return a [-1, -1] or [2, 2] range
 * The different ranges are used to default to white or black in the exposed adjustForContrast
 *
 * @param color - the constant IColor upon which we want to contrast with
 * @param desiredRatio - a contrast ratio (generally from some accesibility standard)
 */
function getContrastingLuminanceRange(
  color: IRGB,
  desiredRatio: number
): ISuggestionRange {
  const relLum: number = relativeLuminance(color.r, color.g, color.b);

  // when background is lighter, solve for darker
  let suggestion: number = (relLum + 0.05) / desiredRatio - 0.05;
  if (suggestion > 0 && suggestion < 1) {
    return { min: 0, max: suggestion };
  }

  // when background is darker, text needs to be lighter
  suggestion = desiredRatio * (relLum + 0.05) - 0.05;
  if (suggestion < 1 && suggestion > 0) {
    return { min: suggestion, max: 1 };
  }

  // We can't achieve the desired ratio
  return { min: -1, max: -1 };
}

/**
 * Calculate the relative luminance which is how bright the color is from the perspective of
 * a human eye.  Blue is much darker than green for instance so (0, 0, 255) is perceived to be
 * significantly darker than (0, 255, 0).  This is used to calculate contrast ratios between
 * two colors to ensure text is readable.
 * @param r - standard red value 0 to 255
 * @param g - standard green value 0 to 255
 * @param b - standard blue value 0 to 255
 */
export function relativeLuminance(r: number, g: number, b: number): number {
  // Formula defined by: http://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html#contrast-ratiodef
  // relative luminance: http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef

  // get the effective radius for each color
  const r1 = standardToLinear(r / 255);
  const g1 = standardToLinear(g / 255);
  const b1 = standardToLinear(b / 255);

  // relative luminance adjusts the R/G/B values by modifiers for their perceived brightness
  // to produce lightness result for how the eye perceives the color
  return 0.2126 * r1 + 0.7152 * g1 + 0.0722 * b1;
}

/**
 * Converts an r, g, or b value in the sRGB color space to the corresponding value in linearRGB
 * This is necessary for relative luminance calculations
 * Formula defined at https://en.wikipedia.org/wiki/SRGB
 *
 * @param c - one of r g or b coming from sRGB
 */
function standardToLinear(c: number): number {
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
