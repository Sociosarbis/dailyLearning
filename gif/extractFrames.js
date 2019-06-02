import { GifReader } from './omggif'

/**
 * @param {ArrayBuffer} buffer
 * @param {Object} options
 * @param {String} [options.mimeType=image/jpeg]
 * @param {Number} [options.quality=1]
 */

export default function extractFrames(buffer, options) {
  options = Object.assign({ mimeType: 'image/jpeg', quality: 1 }, options)
  const typedArr = new Uint8Array(buffer)
  const gifReader = new GifReader(typedArr)
  const frameNum = gifReader.numFrames()
  const framesImageData = []
  let lastFrame
  const screen = document.createElement('canvas')
  screen.width = gifReader.width
  screen.height = gifReader.height
  const ctx = screen.getContext('2d')
  let index = 0
  let next
  function getImageData(i) {
    return new Promise(function(res) {
      const pixels = new Uint8ClampedArray(
        lastFrame || gifReader.width * gifReader.height * 4
      )
      gifReader.decodeAndBlitFrameRGBA(i, pixels)
      const imageData = new ImageData(pixels, gifReader.width)
      ctx.putImageData(imageData, 0, 0)
      screen.toBlob(
        function(blob) {
          res(next(blob))
        },
        options.mimeType,
        options.quality
      )
    })
  }
  function next(blob) {
    if (blob) {
      framesImageData.push(blob)
      index++
    }
    return index < frameNum
      ? getImageData(index)
      : Promise.resolve(framesImageData)
  }
  return Promise.resolve(next()).catch(function(err) {
    console.log(
      `%c${err}`,
      'border-left:2px red solid;border-right:2px red solid;background-color:black;color:white;'
    )
  })
}
