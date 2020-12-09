// Created by Jordan 2019/06/06
let count = 0
const ID_POOL = []
const RAD_TO_DEG = 180 / Math.PI
export default (function() {
  function Hammer(dom, options) {
    return new Manager(dom, options)
  }
  const pcEvList = ['click', 'mousedown']
  const phEvList = ['touchstart', 'touchmove', 'touchend']
  const swipeEvList = [
    'swipe',
    'swipeleft',
    'swiperight',
    'swipeup',
    'swipedown'
  ]
  const eventsMap = {}
  let touchDot = {}
  let timer = null
  let dbCount = 0
  let dbTimer = null
  let lastEvent = ''
  let moveCount = 0
  let touchStartTime = 0
  function Manager(dom, options) {
    this.options = options || {}
    this.dom = dom
    this.eventFn = {}
    // 添加pc端事件
  }

  Manager.exeEventFn = (name, ev) => {
    let target = ev.__bindTarget || ev.target
    if (!['touchend', 'pressup'].includes(name)) {
      lastEvent = name
    }
    while (!ev.cancelBubble && target) {
      if (
        target.__hammerId !== undefined &&
        eventsMap.hasOwnProperty(target.__hammerId)
      ) {
        const hammerInst = eventsMap[target.__hammerId]
        hammerInst.eventFn[name] && hammerInst.eventFn[name](ev)
      }
      target = target.parentElement
      if (target === document.documentElement) target = document
    }
  }

  Manager.emitEvent = e => {
    clearTimeout(timer)
    if (e.type === 'mousedown') {
      // __bindTarget的作用是让上面propagation的从mousedown的target开始
      function emitEvent(ev) {
        ev.__bindTarget = e.target
        Manager.emitEvent(ev)
      }
      function mouseUpEvent(ev) {
        ev.__bindTarget = e.target
        Manager.emitEvent(ev)
        document.removeEventListener('mousemove', emitEvent)
        document.removeEventListener('mouseup', mouseUpEvent)
      }
      document.addEventListener('mousemove', emitEvent)
      document.addEventListener('mouseup', mouseUpEvent)
    }
    if (e.type == 'touchstart' || e.type == 'mousedown') {
      touchDot = e.touches ? e.touches[0] : e
      touchStartTime = Date.now()
      timer = setTimeout(() => {
        if (!swipeEvList.includes(lastEvent)) {
          Manager.exeEventFn('longpress', e)
        }
      }, 350)
      Manager.exeEventFn('pressdown', e)
    } else if (e.type == 'touchend' || e.type == 'mouseup') {
      let touchMove = e.changedTouches ? e.changedTouches[0] : e
      let disX = touchMove.pageX - touchDot.pageX
      let disY = touchMove.pageY - touchDot.pageY
      if (moveCount < 100) {
        const swipeDist = Math.sqrt(Math.pow(disX, 2), Math.pow(disY, 2))
        Object.assign(touchMove, {
          swipeDir: Math.atan2(disY, disX) * RAD_TO_DEG,
          swipeSpeed: (swipeDist * 1000) / (Date.now() - touchStartTime),
          swipeDist
        })
        if (Math.abs(disX) > Math.abs(disY)) {
          if (disX >= 5) {
            Manager.exeEventFn('swiperight', e)
          } else if (disX < -5) {
            Manager.exeEventFn('swipeleft', e)
          }
        } else {
          if (disY >= 5) {
            Manager.exeEventFn('swipedown', e)
          } else if (disY < -5) {
            Manager.exeEventFn('swipeup', e)
          }
        }
      } else {
        moveCount = 0
      }
      Manager.exeEventFn('pressup', e)
      clearTimeout(timer)
      timer = null
    } else {
      if (e.type == 'click') {
        if (!swipeEvList.includes(lastEvent)) {
          Manager.exeEventFn('tap', e)
        }
        dbCount++
        if (dbCount > 1) {
          Manager.exeEventFn('doubletap', e)
        }
        clearTimeout(dbTimer)
        dbTimer = setTimeout(() => {
          dbCount = 0
        }, 200)
        lastEvent = 'tap'
      }
      if (['touchmove', 'mousemove'].includes(e.type)) {
        lastEvent = e.type
        moveCount++
      }
    }
  }
  Manager.inited = false
  Manager.prototype = {
    registerDOM: function() {
      if (!Manager.isinited) {
        pcEvList.concat(phEvList).forEach(function(evtName) {
          document.addEventListener(evtName, Manager.emitEvent)
        })
        Manager.isinited = true
      }
      if (this.dom.__hammerId !== undefined) return
      this.dom.__hammerId = ID_POOL.length ? ID_POOL.pop() : count++
      eventsMap[this.dom.__hammerId] = this
    },
    unregisterDOM: function() {
      if (this.dom.__hammerId) {
        ID_POOL.push(this.dom.__hammerId)
        delete eventsMap[this.dom.__hammerId]
      }
    },
    on: function(event, handler) {
      if (this.dom && event && handler) {
        this.registerDOM()
        this.eventFn[event] = handler
      }
    },
    off: function() {
      if (this.dom) this.unregisterDOM()
    }
  }
  return Hammer
})()
