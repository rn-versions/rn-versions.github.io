import randomSeed from "random-seed";

/**
 * Generates a color with random distribution, stable for a given semver version
 *
 * Derived from:
 * - http://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
 * - https://github.com/devongovett/color-generator
 */
export default function generateColor(identity: string): string {
  let hue = randomSeed.create(identity).random();
  const saturation = 0.9;
  const value = 0.85;
  const goldenRatio = 0.618033988749895;

  hue += goldenRatio;
  hue %= 1;

  const h = hue * 360;
  const s = saturation * 100;
  const v = value * 100;

  return cssColorFromHsv(h, s, v);
}

function cssColorFromHsv(hue: number, sat: number, val: number) {
  const h = hue;
  const l = ((2 - sat / 100) * val) / 2;
  const s = (sat * val) / (l < 50 ? l * 2 : 200 - l * 2);

  return `hsl(${h}, ${Math.round(s)}%, ${Math.round(l)}%)`;
}
