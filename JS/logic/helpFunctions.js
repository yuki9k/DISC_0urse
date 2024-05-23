export function get_instance_dom_id(parent_id, id) {
  return document.getElementById(`${parent_id}_instance_${id}`);
}

export async function fetcher(request) {
  const success = {};
  const response = await fetch(request);
  success.ok = response.ok;
  success.status = response.status;
  if (!success.ok) {
    return success;
  }
  const resource = await response.json();

  return {
    resource: resource,
    success: success,
  };
}

export function colorToHsl(c) {
  const { type, value } = c;
  let r, g, b;

  // Converts color value to rgb if argument is in hex
  if (type === "hex") {
    r = parseInt(value.slice(1, 3), 16);
    g = parseInt(value.slice(3, 5), 16);
    b = parseInt(value.slice(5, 7), 16);
  } else if (type === "rgb") {
    r = value.r;
    g = value.g;
    b = value.b;
  } else {
    return null;
  }

  // Get fractions
  r /= 255;
  g /= 255;
  b /= 255;

  // RGB to HSL
  let h, s, l;

  // Find cmin, cmax and delta
  const cmin = Math.min(r, g, b);
  const cmax = Math.max(r, g, b);
  const delta = cmax - cmin;

  // Calculate hue
  if (cmax === r) {
    h = ((g - b) / delta) % 6;
  } else if (cmax === g) {
    h = (b - r) / delta + 2;
  } else if (cmax === b) {
    h = (r - g) / delta + 4;
  } else {
    h = 0;
  }

  h = Math.round(h * 60);
  if (h < 0) h += 360;

  // Calculate luminance
  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // Convert to values out of 100 (because saturation and luminance are represented by 0 - 100%)
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return { h, s, l };
}
