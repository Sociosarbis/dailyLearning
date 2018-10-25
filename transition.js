function transitionProxy(root) {
  const Tween = {
    linear: function(currentValue, targetValue, duration, currentTime) {
      return (
        currentValue + (currentTime / duration) * (targetValue - currentValue)
      )
    }
  }
  const innerScope = {
    isRunning: false,
    targetValues: new Map(),
    startValues: new Map(),
    easingFunc: Tween.linear,
    currentTime: 0,
    duration: 1000
  }
  const patches = []
  let startUnixTime = 0
  let timerId = null
  let tweenId = null
  const easingFunc = Tween.linear
  function play() {
    innerScope.currentTime = Date.now() - startUnixTime
    if (innerScope.currentTime >= innerScope.duration)
      innerScope.currentTime = innerScope.duration
    innerScope.targetValues.forEach(function(value, key) {
      if (root[key] !== innerScope.targetValues.get(key)) {
        root[key] = easingFunc(
          innerScope.startValues.get(key),
          innerScope.targetValues.get(key),
          innerScope.duration,
          innerScope.currentTime
        )
      }
      console.log(root[key])
    })
    if (innerScope.currentTime !== innerScope.duration)
      tweenId = requestAnimationFrame(play)
    else {
      innerScope.isRunning = false
      innerScope.targetValues.clear()
      tweenId = null
    }
  }
  const traps = {
    set: function(target, key, value, receiver) {
      if (target.hasOwnProperty(key)) {
        innerScope.isRunning = false
        clearTimeout(timerId)
        patches.push({
          key,
          value
        })
        timerId = setTimeout(function() {
          if (!innerScope.isRunning) {
            innerScope.targetValues.clear()
            innerScope.startValues.clear()
          }
          patches.forEach(function(p) {
            innerScope.targetValues.set(p.key, p.value)
            innerScope.startValues.set(p.key, target[p.key])
          })
          patches.length = 0
          innerScope.isRunning = true
          timerId = null
          startUnixTime = Date.now()
          cancelAnimationFrame(tweenId)
          tweenId = play()
        })
      }
    },
    get: function(target, key, receiver) {
      if (target.hasOwnProperty(key)) return target[key]
      else return innerScope[key]
    }
  }
  return new Proxy(root, traps)
}
const x = {
  width: 10,
  height: 500
}
const tX = transitionProxy(x)
tX.width = 100
tX.height = 5000
