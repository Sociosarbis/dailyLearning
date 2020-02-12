type AxisPropNameMap = {
  start: string,
  end: string,
  scalar: string,
  overflow: string,
  scroll: string,
  borderWidth: string,
  clientScalar: string,
  scrollScalar: string,
  windowScalar: string,
}

type ElementContext = {
  width: number,
  height: number,
  top: number,
  left: number
}

const axes: { [axis: string]: AxisPropNameMap } = {
  x: {
    start: 'left',
    end: 'right',
    scalar: 'width',
    overflow: 'overflowX',
    scroll: 'scrollLeft',
    borderWidth: 'borderLeftWidth',
    clientScalar: 'clientWidth',
    scrollScalar: 'scrollWidth',
    windowScalar: 'innerWidth'
  },
  y: {
    start: 'top',
    end: 'bottom',
    scalar: 'height',
    overflow: 'overflowY',
    scroll: 'scrollTop',
    borderWidth: 'borderTopWidth',
    clientScalar: 'clientHeight',
    scrollScalar: 'scrollHeight',
    windowScalar: 'innerHeight'
  }
}

function scrollIntoView(
  el: HTMLElement,
  padding = { top: 10, bottom: 10, left: 10, right: 10 }
) {
  let cur = el.parentElement
  const rect = el.getBoundingClientRect()
  let ctx = ['x', 'y'].reduce(function(acc, axis) {
    var axisInfo = axes[axis]
    acc[axisInfo.start] = rect[axisInfo.start] - padding[axisInfo.start]
    acc[axisInfo.scalar] =
      rect[axisInfo.scalar] + padding[axisInfo.start] + padding[axisInfo.end]
    return acc
  }, {} as ElementContext)
  while (cur) {
    const computedStyle = getComputedStyle(cur)
    const curRect = cur.getBoundingClientRect()
    const scrollDist = ['x', 'y'].reduce(
      function(acc, axis, index) {
        var axisInfo = axes[axis]
        var overflow = computedStyle[axisInfo.overflow]
        if (
          overflow !== 'visible' &&
          overflow !== 'hidden' &&
          cur[axisInfo.scrollScalar] > cur[axisInfo.clientScalar]
        ) {
          const curRectStart =
            curRect[axisInfo.start] +
            parseFloat(computedStyle[axisInfo.borderWidth])
          const curRectEnd = curRectStart + cur[axisInfo.clientScalar]
          const maxScroll =
            cur[axisInfo.scrollScalar] - cur[axisInfo.clientScalar]
          const delta = maxScroll - cur[axisInfo.scroll]
          const startDelta = ctx[axisInfo.start] - curRectStart
          const endDelta =
            ctx[axisInfo.start] + ctx[axisInfo.scalar] - curRectEnd
          if (startDelta < 0) {
            if (cur[axisInfo.scroll] > 0) {
              const scrollDist =
                -startDelta > cur[axisInfo.scroll]
                  ? -cur[axisInfo.scroll]
                  : startDelta
              acc[index] = scrollDist
              ctx[axisInfo.start] -= scrollDist
            }
          } else if (endDelta > 0) {
            if (delta > 0) {
              const scrollDist = endDelta > delta ? delta : endDelta
              acc[index] = scrollDist
              ctx[axisInfo.start] -= scrollDist
            }
          }
        }
        return acc
      },
      [0, 0]
    )
    cur.scrollBy(scrollDist[0], scrollDist[1])
    cur = cur.parentElement
  }
  const scrollDist = ['x', 'y'].reduce(
    function(acc, axis, index) {
      const axisInfo = axes[axis]
      if (ctx[axisInfo.start] < 0) {
        acc[index] = ctx[axisInfo.start]
      } else if (
        ctx[axisInfo.start] + ctx[axisInfo.scalar] >
        window[axisInfo.windowScalar]
      ) {
        acc[index] =
          ctx[axisInfo.start] +
          ctx[axisInfo.scalar] -
          window[axisInfo.windowScalar]
      }
      return acc
    },
    [0, 0]
  )
  window.scrollBy(scrollDist[0], scrollDist[1])
}
