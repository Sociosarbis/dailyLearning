type RGB = {
  r: number,
  g: number,
  b: number
}

function applyGammaCorrection(value: number) {
	if (value < 0.03928) {
		return value / 12.92
	} else {
		return Math.pow((value + 0.055) / 1.055, 2.4)
	}
}

function normalizeColor(value: number) {
  return value / 255
}

function normalizeRGB(color: RGB) {
  return {
    r: normalizeColor(color.r),
    g: normalizeColor(color.g),
    b: normalizeColor(color.b),
  }
}

function calcLuminance(color: RGB) {
  const { r, g, b } = normalizeRGB(color)
	return normalizeColor(r) * 0.2126 + normalizeColor(g) * 0.7152 + normalizeColor(b) * 0.0722
}

function calcGreyScale(color: RGB) {
  return 0.299* color.r+0.587*color.g+0.114*color.b
}

function calcContrast(color1:RGB, color2: RGB) {
  const lumin1 = calcLuminance(color1)
  const lumin2 = calcLuminance(color2)
  return lumin1 > lumin2 ? lumin1 / lumin2 : lumin2 / lumin1
}

let baseFontSize = 14

const n = 5
const r = (Math.sqrt(5) - 1) / 2 

function isEven(value: number) {
  return value % 2 === 0
}

function toEven(value: number) {
  const tempValue = Math.round(value)
  return isEven(tempValue) ? 
    tempValue 
    : tempValue < value ?
      tempValue + 1
      : tempValue - 1
      
}

function mapFontLevelToSizeAndHeight(i: number) {
  let fontSize = baseFontSize * Math.pow(Math.E, i / n)
  const lineHeight = toEven(fontSize * (1 + r * Math.pow(Math.E, -i / n)))
  return {
    fontSize: toEven(fontSize),
    lineHeight
  }
}


export {
  calcContrast,
  mapFontLevelToSizeAndHeight
}
