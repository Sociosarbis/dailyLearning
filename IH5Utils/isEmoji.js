/*
  @source https://github.com/Dafrok/if-emoji
*/
const ArrayLikeToString = arg => Array.prototype.toString.call(arg)
let canvas = null
let ctx = null
const emojiCache = Object.create(null)
const BLANK_EMOJI = '\ud83d\uddbe'
let BLANK_EMOJI_FEATURE_STR = ''
let renderSize = 1
let fontSize = 100
const getTextFeature = text => {
  try {
    if (!canvas) {
      canvas = document.createElement('canvas')
      canvas.width = renderSize
      canvas.height = renderSize
      ctx = canvas.getContext('2d')
      ctx.scale(renderSize / fontSize, renderSize / fontSize)
      ctx.fillStyle = '#000000'
      ctx.font = `${fontSize}px -no-font-family-here-`
      ctx.textBaseline = 'top'
      ctx.fillText(BLANK_EMOJI, 0, 0)
      BLANK_EMOJI_FEATURE_STR = ArrayLikeToString(
        ctx.getImageData(0, 0, renderSize, renderSize).data
      )
    }
    ctx.clearRect(0, 0, fontSize, fontSize)
    ctx.fillText(text, 0, 0)

    return ctx.getImageData(0, 0, renderSize, renderSize).data
  } catch (e) {
    return false
  }
}

const compareFeatures = feature1 => {
  const feature1Str = ArrayLikeToString(feature1)
  return feature1Str !== BLANK_EMOJI_FEATURE_STR
}

function isCharSupport(text) {
  if (emojiCache[text] !== undefined) return emojiCache[text]
  const feature1 = getTextFeature(text)
  const isSupport = feature1 && compareFeatures(feature1)
  emojiCache[text] = isSupport
  return isSupport
}

export default function cleanNonSupportChar(text) {
  return typeof text !== 'string'
    ? ''
    : text
        .match(/[\uD800-\uDBFF][\uDC00-\uDFFF]?|[^\uD800-\uDFFF]|./g)
        .filter(char => {
          if (char.length === 0) return false
          else if (
            char.length === 1 &&
            (!/[\u00A9-\u3299]/.test(char) || char === BLANK_EMOJI)
          )
            return true
          return isCharSupport(char)
        })
        .join('')
}
