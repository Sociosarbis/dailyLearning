import { Matrix3 } from '../../utils/tinyMatrix'
import { equal } from '../../utils/numeric'

const extractPXRegExp = /^\s*(.+)px\s*$/
const extractMatrixRegExp = new RegExp(
  '^\\s*matrix\\(' + new Array(6).fill('\\s*([^,]+)\\s*').join(',') + '\\)\\s*$'
)
const extractMatrix3DRegExp = new RegExp(
  '^\\s*matrix3d\\(' +
    new Array(16).fill('\\s*([^,]+)\\s*').join(',') +
    '\\)\\s*$'
)
const extractOriginRegExp = new RegExp(
  '^\\s*' +
    new Array(2).fill('([^\\s]+)px').join('\\s+') +
    '(?:\\s+([^s]+)px)?\\s*$'
)

let rootClassName = 'stage-container'

function matrix3dTo2d(style) {
  const extractedValue = extractMatrix3DRegExp.exec(
    style,
    extractMatrix3DRegExp
  )
  return extractedValue
    ? [
        extractedValue[1],
        extractedValue[2],
        extractedValue[5],
        extractedValue[6],
        extractedValue[4],
        extractedValue[8]
      ].map(function(num) {
        let number = parseFloat(num)
        return isNaN(number) ? 0 : number
      })
    : null
}

function normalizeStyleValue(style, regExp) {
  const extractedValue = regExp.exec(style)
  return extractedValue
    ? extractedValue.length > 1
      ? extractedValue.slice(1).map(function(num) {
          let number = parseFloat(num)
          return isNaN(number) ? 0 : number
        })
      : extractedValue[1]
    : null
}

export function getDOMComputedStyle(DOM) {
  const nativeComputedStyle = window.getComputedStyle(DOM)
  return {
    left: normalizeStyleValue(nativeComputedStyle.left, extractPXRegExp),
    top: normalizeStyleValue(nativeComputedStyle.top, extractPXRegExp),
    transform:
      normalizeStyleValue(nativeComputedStyle.transform, extractMatrixRegExp) ||
      matrix3dTo2d(nativeComputedStyle.transform),
    origin: normalizeStyleValue(
      nativeComputedStyle['transformOrigin'],
      extractOriginRegExp
    )
  }
}

export function computeLocalTransform(DOM) {
  const curMat = new Matrix3()
  const { left, top, transform, origin } = getDOMComputedStyle(DOM)
  if (left !== 0 || top !== 0)
    curMat.translate({
      x: left,
      y: top
    })
  if (transform) {
    let transformMatrix = new Matrix3({
      a: transform[0],
      b: transform[1],
      c: transform[2],
      d: transform[3],
      tx: transform[4],
      ty: transform[5]
    })
    if (!transformMatrix.isIdentity()) {
      if (origin[0] !== 0 || origin[1] !== 0) {
        curMat.tx += origin[0]
        curMat.ty += origin[1]
        transformMatrix.translate({
          x: -origin[0],
          y: -origin[1]
        })
      }
      curMat.dot(transformMatrix)
    }
  }
  return curMat
}

export function computeWorldTransform(DOM) {
  let worldMatrix = new Matrix3()
  let curDOM = DOM
  while (curDOM && !curDOM.classList.contains(rootClassName)) {
    const curMat = computeLocalTransform(curDOM)
    if (!curMat.isIdentity()) {
      worldMatrix = curMat.dot(worldMatrix)
    }
    curDOM = curDOM.offsetParent
  }
  return worldMatrix
}

export function transformMapping(key, value) {
  let regExpRes
  const valueParsed = parseFloat(value)
  if (isNaN(valueParsed)) return
  if ((regExpRes = /^rotate(.*)$/.exec(key))) {
    if (!regExpRes[1] || regExpRes[1] === 'Z') {
      return ['rotate', (valueParsed * Math.PI) / 180]
    }
  } else if ((regExpRes = /^scale(.*)$/.exec(key))) {
    return [
      'scale',
      {
        x: regExpRes[1] === 'Y' ? 1 : valueParsed,
        y: regExpRes[1] === 'X' ? 1 : valueParsed
      }
    ]
  } else if ((regExpRes = /^translate(.*)$/.exec(key))) {
    return [
      'translate',
      {
        x: regExpRes[1] === 'Y' ? 0 : valueParsed,
        y: regExpRes[1] === 'X' ? 0 : valueParsed
      }
    ]
  } else if ((regExpRes = /^skew(.*)$/.exec(key))) {
    return (
      (regExpRes[1] === 'Y' || regExpRes[1] === 'X') && [
        regExpRes[0],
        (valueParsed * Math.PI) / 180
      ]
    )
  }
}

export function transformToMatrix(transform) {
  const transformMatrix = new Matrix3()
  transform &&
    transform.forEach(function(tr) {
      Object.keys(tr).forEach(function(trKey) {
        const methodAndArg = transformMapping(trKey, tr[trKey])
        methodAndArg &&
          Matrix3.prototype[methodAndArg[0]].apply(
            transformMatrix,
            methodAndArg.slice(1)
          )
      })
    })
  return transformMatrix
}

export function transformToCSS(transform) {
  const transformCSSArr = []
  transform &&
    transform.forEach(function(tr) {
      Object.keys(tr).forEach(function(trKey) {
        const valueParsed = parseFloat(tr[trKey])
        if (isNaN(valueParsed)) return
        trKey.startsWith('scale')
          ? valueParsed !== 1
            ? transformCSSArr.push(`${trKey}(${valueParsed})`)
            : void 0
          : valueParsed !== 0
          ? transformCSSArr.push(
              `${trKey}(${valueParsed}${
                trKey.startsWith('rotate') || trKey.startsWith('skew')
                  ? 'deg'
                  : 'px'
              })`
            )
          : void 0
      })
    })
  return transformCSSArr.join(' ')
}

export function getPointsBound(ptArr) {
  return ptArr.reduce(
    function(bound, pt) {
      return {
        minX: pt.x < bound.minX ? pt.x : bound.minX,
        minY: pt.y < bound.minY ? pt.y : bound.minY,
        maxX: pt.x > bound.maxX ? pt.x : bound.maxX,
        maxY: pt.y > bound.maxY ? pt.y : bound.maxY
      }
    },
    {
      minX: Infinity,
      minY: Infinity,
      maxX: -Infinity,
      maxY: -Infinity
    }
  )
}

export function isV4Widget(node) {
  return node.props && node.props.hasOwnProperty('selectorPrefix')
    ? !node.props.selectorPrefix !== 'app'
    : !node.type.startsWith('app-')
}

// canMerge表示可与之合并的属性, canSkip表示在查找可合并属性时可跳过的属性，默认只可merge本身和不能skip
export const transformRelationRules = {
  rotate: {
    canMerge: ['rotateZ', 'rotate']
  },
  rotateZ: {
    canMerge: ['rotateZ', 'rotate']
  },
  scale: {
    canSkip: 'all',
    mergeOp: 'multiply'
  },
  scaleX: {
    canSkip: ['scaleY', 'scale'],
    mergeOp: 'multiply'
  },
  scaleY: {
    canSkip: ['scaleX', 'scale'],
    mergeOp: 'multiply'
  },
  perspective: {
    canSkip: 'all'
  }
}

export function cleanTransform(transform) {
  const cleanedTransform = transform || []
  loop1: for (let i = cleanedTransform.length - 1; i >= 0; i--) {
    if (!cleanedTransform[i]) {
      cleanedTransform.splice(i, 1)
      continue
    }
    const curTransform = Object.keys(cleanedTransform[i])[0]
    if (!curTransform) {
      cleanedTransform.splice(i, 1)
      continue
    }
    const rule = transformRelationRules[curTransform]
    if (
      (rule && rule.mergeOp === 'multiply'
        ? equal(cleanedTransform[i][curTransform], 1)
        : equal(cleanedTransform[i][curTransform]),
      0)
    ) {
      cleanedTransform.splice(i, 1)
      continue
    }
    for (let j = i - 1; j >= 0; j--) {
      if (!cleanedTransform[j]) continue
      const targetTransform = Object.keys(cleanedTransform[j])[0]
      if (!targetTransform[j]) continue
      if (
        (rule &&
          rule.hasOwnProperty('canMerge') &&
          rule.canMerge.indexOf(targetTransform) !== -1) ||
        targetTransform === curTransform
      ) {
        rule && rule.mergeOp && rule.mergeOp === 'multiply'
          ? Reflect.set(
              cleanedTransform[j],
              targetTransform,
              cleanedTransform[j][targetTransform] *
                cleanedTransform[i][curTransform]
            )
          : Reflect.set(
              cleanedTransform[j],
              targetTransform,
              cleanedTransform[j][targetTransform] +
                cleanedTransform[i][curTransform]
            )
        cleanedTransform.splice(i, 1)
        continue loop1
      } else if (
        rule &&
        rule.hasOwnProperty('canSkip') &&
        (rule.canSkip === 'all' || rule.canSkip.indexOf(targetTransform))
      )
        continue
    }
    let unit,
      isStr = false,
      val = cleanedTransform[i][curTransform]
    if (typeof cleanedTransform[i][curTransform] === 'string') {
      isStr = true
      const valUnit = /^(.*?)([a-z]*)$/.exec(cleanedTransform[i][curTransform])
      if (valUnit) {
        val = valUnit[1]
        unit = valUnit[2]
      }
    }
    Reflect.set(
      cleanedTransform[i],
      curTransform,
      parseFloat(val) + (isStr ? unit || '' : 0)
    )
  }
  return cleanedTransform
}

export function generalStyleToVariant(style, currentNode) {
  const { width, height, left, top, transform } = style
  const props = {}
  const cleanedTransform = cleanTransform(transform)
  if (isV4Widget(currentNode)) {
    !isNaN(width) && Reflect.set(props, 'width', Math.round(width))
    !isNaN(height) && Reflect.set(props, 'height', Math.round(height))
    !isNaN(left) && Reflect.set(props, 'x', Math.round(left))
    !isNaN(top) && Reflect.set(props, 'y', Math.round(top))
    cleanedTransform.forEach(function(tr) {
      tr &&
        Object.keys(tr).forEach(function(key) {
          props[key] = parseFloat(tr[key])
        })
    })
  } else {
    !isNaN(width) && Reflect.set(props, '@width', Math.round(width))
    !isNaN(height) && Reflect.set(props, '@height', Math.round(height))
    !isNaN(left) && Reflect.set(props, '@left', Math.round(left))
    !isNaN(top) && Reflect.set(props, '@top', Math.round(top))
    props['@transform'] = cleanedTransform
  }
  return props
}
