import EventEmitter from './EventEmitter'

function q(selector) {
  return document.querySelector(selector)
}

function createCustomEvent(eventName, sourceEvent, configs = {}) {
  const customEvent = new Event(eventName, {
    bubbles: Boolean(configs.isBubbles)
  })
  Object.assign(
    customEvent,
    {
      sourceTarget: sourceEvent.target,
      sourceEvent
    },
    configs
  )
  return customEvent
}
function cacheN(n) {
  const cache = []
  return function(num) {
    cache.push(num)
    if (cache.length > n) {
      cache.splice(0, cache.length - n)
    }
    return cache
  }
}
function avg(arr) {
  return (
    arr.reduce(function(sum, num) {
      return (sum += num)
    }, 0) / arr.length
  )
}

export class GestureRecognizer extends EventEmitter {
  constructor({ enablePinch = true, enableRotate = true } = {}) {
    super()
    this._fingers = 0
    this._centroid = new Float32Array([0, 0])
    this._pinchRcn = new PinchRecognizer()
    this._rotateRcn = new RotateRecognizer()
    this._enablePinch = enablePinch
    this._enableRotate = enableRotate
  }

  handleFingerDown(e) {
    if (e.touches) {
      this._fingers = Math.min(e.touches.length, this._fingers + 1)
      this.handleFingersNumberChange(e)
    }
  }

  handleFingerUp(e) {
    if (e.touches) {
      this._fingers = Math.max(0, this._fingers - 1)
      this.handleFingersNumberChange(e)
    }
  }

  handleFingersNumberChange(e) {
    if (this._fingers >= 2) {
      const { _enablePinch, _enableRotate, _pinchRcn, _rotateRcn } = this
      const [
        { clientX: clientX0, clientY: clientY0 },
        { clientX: clientX1, clientY: clientY1 }
      ] = e.touches
      this._centroid[0] = (clientX0 + clientX1) / 2
      this._centroid[1] = (clientY0 + clientY1) / 2
      _enableRotate && _rotateRcn.handleFingersNumberChange(e)
      _enablePinch && _pinchRcn.handleFingersNumberChange(e)
    }
  }

  handleFingersMove(e) {
    if (this._fingers >= 2) {
      const { _enablePinch, _enableRotate, _pinchRcn, _rotateRcn } = this
      const rotateInfos = _enableRotate && _rotateRcn.handleFingersMove(e)
      const pinchInfos = _enablePinch && _pinchRcn.handleFingersMove(e)
      const transformsList = []
      if (rotateInfos) transformsList.push(['rotate', rotateInfos])
      if (pinchInfos) transformsList.push(['pinch', pinchInfos])
      this.emit('transform', transformsList)
      return true
    }
  }
}

class PinchRecognizer {
  constructor() {
    this._baseDist = 0
  }

  handleFingersNumberChange(e) {
    const touchesList = e.touches
    const [
      { clientX: clientX0, clientY: clientY0 },
      { clientX: clientX1, clientY: clientY1 }
    ] = touchesList
    this._baseDist =
      Math.pow(clientX0 - clientX1, 2) + Math.pow(clientY0 - clientY1, 2)
    this._cacheScale3 = cacheN(3)
  }

  handleFingersMove(e) {
    const [
      { clientX: clientX0, clientY: clientY0 },
      { clientX: clientX1, clientY: clientY1 }
    ] = e.touches
    const { _baseDist, _cacheScale3 } = this
    const distX = clientX0 - clientX1
    const distY = clientY0 - clientY1
    const nextScale = Math.sqrt(
      avg(_cacheScale3(Math.pow(distX, 2) + Math.pow(distY, 2))) / _baseDist
    )
    return {
      scaleX: nextScale,
      scaleY: nextScale,
      centroidX: clientX1 + distX / 2,
      centroidY: clientY1 + distY / 2
    }
  }
}

class RotateRecognizer {
  constructor() {
    this._baseAngle = 0
  }

  handleFingersNumberChange(e) {
    const touchesList = e.touches
    const [
      { clientX: clientX0, clientY: clientY0 },
      { clientX: clientX1, clientY: clientY1 }
    ] = touchesList
    this._baseAngle = Math.atan2(clientY0 - clientY1, clientX0 - clientX1)
    this._cacheAngle3 = cacheN(3)
  }

  handleFingersMove(e) {
    const [
      { clientX: clientX0, clientY: clientY0 },
      { clientX: clientX1, clientY: clientY1 }
    ] = e.touches
    const { _baseAngle, _cacheAngle3 } = this
    const distX = clientX0 - clientX1
    const distY = clientY0 - clientY1
    return {
      angle: avg(_cacheAngle3(Math.atan2(distY, distX))) - _baseAngle
    }
  }
}

let useMouse = !('ontouchstart' in document.documentElement)
function onPointerDown(el, cb) {
  let fingers = 1,
    cache3,
    baseDist,
    prevScale = 1
  let downTime
  let startX
  let startY
  function downCb(e) {
    if (useMouse) {
      if (/^touch/.test(e.type)) return
    } else {
      if (/^mouse/.test(e.type)) return
    }
    downTime = Date.now()
    const event = new Event('gesturedown')
    event.sourceTarget = e.target
    event.sourceEvent = e
    if (e.touches && e.touches.length) {
      event.clientX = e.touches[0].clientX
      event.clientY = e.touches[0].clientY
      el.dispatchEvent(event)
      handleFingersNumberChange(e)
    } else {
      event.clientX = e.clientX
      event.clientY = e.clientY
      on(window, 'mousemove', moveCb, { passive: false, capture: true })
      once(window, 'mouseup', upCb, { passive: false, capture: true })
      el.dispatchEvent(event)
    }
    startX = event.clientX
    startY = event.clientY
  }

  function handleFingersNumberChange(e) {
    const nextFingers = (e.touches && e.touches.length) || 1
    if (fingers !== nextFingers) {
      fingers = nextFingers
      if (fingers >= 2) {
        const touchesList = e.touches
        baseDist =
          Math.pow(touchesList[0].clientX - touchesList[1].clientX, 2) +
          Math.pow(touchesList[0].clientY - touchesList[1].clientY, 2)
        cache3 = cacheN(3)
        prevScale = 1
      }
    }
  }

  function moveCb(e) {
    if (useMouse) {
      if (/^touch/.test(e.type)) return
    } else {
      if (/^mouse/.test(e.type)) return
    }
    const event = new Event('gesturemove')
    event.sourceTarget = e.target
    event.sourceEvent = e
    if (e.touches && e.touches.length) {
      event.clientX = e.touches[0].clientX
      event.clientY = e.touches[0].clientY
      el.dispatchEvent(event)
      if (fingers >= 2) {
        const nextScale = Math.sqrt(
          avg(
            cache3(
              Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) +
                Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2)
            )
          ) / baseDist
        )
        const pinchEvent = createCustomEvent('pinch', e, {
          scale: nextScale - prevScale,
          centroidX: (e.touches[0].clientX + e.touches[1].clientX) / 2,
          centroidY: (e.touches[0].clientY + e.touches[1].clientY) / 2
        })
        prevScale = nextScale
        el.dispatchEvent(pinchEvent)
      }
    } else {
      event.clientX = e.clientX
      event.clientY = e.clientY
      el.dispatchEvent(event)
    }
  }
  function upCb(e) {
    if (useMouse) {
      if (/^touch/.test(e.type)) return
    } else {
      if (/^mouse/.test(e.type)) return
    }
    const event = new Event('gestureup')
    event.sourceTarget = e.target
    event.sourceEvent = e
    if (e.changedTouches && e.changedTouches.length) {
      event.clientX = e.changedTouches[0].clientX
      event.clientY = e.changedTouches[0].clientY
      el.dispatchEvent(event)
      handleFingersNumberChange(e)
    } else {
      event.clientX = e.clientX
      event.clientY = e.clientY
      el.dispatchEvent(event)
      off(window, 'mousemove', moveCb, { passive: false, capture: true })
    }
    if (
      Date.now() - downTime < 200 &&
      Math.pow(startX - event.clientX, 2) +
        Math.pow(startY - event.clientY, 2) <
        25
    ) {
      const tapEvent = createCustomEvent('vxgesturetap', e, { isBubbles: true })
      el.dispatchEvent(tapEvent)
    }
  }

  on(el, 'mousedown', downCb, { passive: false })
  on(el, 'touchstart', downCb, { passive: false })
  on(el, 'touchmove', moveCb, { passive: false })
  on(el, 'touchend', upCb, { passive: false })
  on(el, 'gesturedown', cb, { passive: false })
  return function() {
    off(el, 'mousedown', downCb, { passive: false })
    off(el, 'touchstart', downCb, { passive: false })
    off(el, 'gesturedown', cb, { passive: false })
    off(el, 'touchmove', moveCb, { passive: false })
    off(el, 'touchend', upCb, { passive: false })
    off(window, 'mousemove', moveCb, { passive: false, capture: true })
    off(window, 'mouseup', upCb, { passive: false, capture: true })
  }
}
function forEach(obj, cb) {
  if (obj.forEach !== undefined) {
    obj.forEach(cb)
  } else if (obj.length !== undefined) {
    Array.prototype.forEach.call(obj, cb)
  } else {
    Object.keys(obj).forEach(cb)
  }
}
function slice(obj, start, end) {
  if (obj.slice !== undefined) {
    return obj.slice(start, end)
  } else if (obj.length !== undefined) {
    return Array.prototype.slice.call(obj, start, end)
  }
}
function child(list, index) {
  const _index = index < 0 ? list.length + index : index
  return _index > list.length || _index < 0 ? null : list[_index]
}
function rect(el) {
  const rect = el.getBoundingClientRect()
  return {
    x: rect.left,
    y: rect.top,
    width: rect.width,
    height: rect.height
  }
}
function once(el, event, handler, options = {}) {
  el.addEventListener(event, handler, Object.assign(options, { once: true }))
}
function on(el, event, handler, options) {
  el.addEventListener(event, handler, options)
  return function() {
    off(el, event, handler, options)
  }
}
function off(el, event, handler, options) {
  el.removeEventListener(event, handler, options)
}
function clamp(value, min, max) {
  if (value < min) {
    return min
  } else if (value > max) {
    return max
  } else {
    return value
  }
}
export { q, onPointerDown, forEach, child, slice, rect, once, on, off, clamp }
