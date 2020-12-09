export const debounce = function(idle, action) {
  var last
  return function() {
    var ctx = this,
      args = arguments
    clearTimeout(last)
    last = setTimeout(function() {
      action.apply(ctx, args)
    }, idle)
  }
}

export function checkIsInBounds(point, rect) {
  return (
    point.x >= rect.left &&
    point.x <= rect.left + rect.width &&
    point.y >= rect.top &&
    point.y <= rect.top + rect.height
  )
}

export function absAtLeast(num, std) {
  return num >= 0 ? Math.max(std, num) : Math.min(-std, num)
}

export function binarySearch(
  arr,
  target,
  searchFunc = function(val) {
    return val
  }
) {
  if (arr.length < 3)
    return arr.findIndex(function(a) {
      return searchFunc(a) === target
    })
  let right = arr.length - 1
  let mid = (right / 2) | 0
  let left = 0
  let midVal = searchFunc(arr[mid])
  while (left <= right) {
    if (midVal === target) {
      return mid
    } else if (midVal < target) {
      left = mid + 1
    } else {
      right = mid - 1
    }
    mid = ((left + right) / 2) | 0
    midVal = searchFunc(arr[mid])
  }
  return -1
}

export function isRangeIntersect(min1, max1, min2, max2) {
  return !(max1 < min2 || max2 < min1)
}

export function getMinMax(num1, num2) {
  let min = num1,
    max = num2
  if (num1 > num2) {
    max = num1
    min = num2
  }
  return [min, max]
}

/**
 *
 * @param {object} line1 { x1, x2, y1, y2}
 * @param {object} line2 { x1, x2, y1, y2}
 * ref: https://blog.csdn.net/wcl0617/article/details/78654944
 */
export function getIntersectPos(line1, line2) {
  const aX = line1.x2 - line1.x1
  const aY = line1.y2 - line1.y1
  const bX = line2.x2 - line2.x1
  const bY = line2.y2 - line2.y1
  const crossProd = aX * bY - aY * bX
  const tX = line2.x1 - line1.x1
  const tY = line2.y1 - line1.y1
  const t = (tX * bY - tY * bX) / crossProd
  const b = (-aX * tY + aY * tX) / crossProd
  return [t, b]
}

/**
 *
 * @param {Array} arr1
 * @param {Array} arr2
 * @param {Function} [boolFunc=function (a, b) { return a === b }] judge the two elements of the same index from the two array respectively are equal or not
 */
export function isArrEqual(
  arr1,
  arr2,
  boolFunc = function(a, b) {
    return a === b
  }
) {
  if (
    Array.isArray(arr1) &&
    Array.isArray(arr2) &&
    arr1.length === arr2.length
  ) {
    return !arr1.some(function(a, i) {
      return !boolFunc(a, arr2[i])
    })
  } else return false
}

/**
 * the chaninable version of the native Array.prototype.splice method
 * @returns {Array}
 */
export function chainSplice(arr, index, deleteCount, ...items) {
  arr.splice(index, deleteCount, ...items)
  return arr
}

/**
 * @param {Number} number1
 * @param {Number} number2
 * @param {Number} [torlerance=0.01] positive number
 */
export function approxEqual(number1, number2, torlerance = 0.01) {
  return Math.abs(number1 - number2) < torlerance
}
export function isUndef(obj) {
  return obj === undefined || obj === null
}

export function isObject(obj) {
  return typeof obj === 'object' && !(isUndef(obj) || obj[Symbol.iterator])
}

export const FILE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB']

export function logN(base, number) {
  return Math.log(number) / Math.log(base)
}

export function trimUnit(numWithUnit, relativeTo) {
  if (typeof numWithUnit === 'number') return numWithUnit
  else {
    let parsedNum = parseFloat(numWithUnit)
    if (typeof numWithUnit === 'string' && numWithUnit.endsWith('%')) {
      parsedNum = (parsedNum / 100) * relativeTo
    }
    return parsedNum
  }
}

//assume that the type of obj only can be one of [number, string, undefined, null, Object, Array]
export function deepCopy(obj, replacer) {
  if (Array.isArray(obj)) {
    return obj.map(function(o) {
      return deepCopy(o, replacer)
    })
  } else if (obj && typeof obj === 'object') {
    if (typeof obj.toJSON === 'function') {
      return obj.toJSON()
    } else {
      return Object.keys(obj).reduce(function(res, k) {
        const value = deepCopy(
          replacer ? replacer(k, obj[k]) : obj[k],
          replacer
        )
        if (value !== undefined) {
          res[k] = value
        }
        return res
      }, {})
    }
  } else return obj
}

//获取小数位数
export function getDecimalLength(number) {
  if (isNaN(number)) return
  if (number === Math.round(number)) return 0
  const matcher = (number + '').match(/\d*\.(\d*)[eE]*([+-]*\d+)*/)
  let floatLength = matcher[1].length
  if (matcher[2]) {
    floatLength -= +matcher[2]
  }
  return floatLength
}

export function camelize(name) {
  var parts = name.split('-')
  var rest = parts
    .slice(1)
    .map(function(part) {
      return part[0].toUpperCase() + part.slice(1)
    })
    .join('')
  return parts[0] + rest
}

export function getTargetQuery(target) {
  let query = location.search.substring(1).split('&')
  let value
  for (let str of query) {
    if (str !== '') {
      let item = str.split('=')
      if (item.length === 2) {
        if (item[0] === target) {
          value = item[1]
        }
      }
    }
  }
  return value
}

export function isObjEqual(obj1, obj2) {
  if (isObject(obj1) && isObject(obj2)) {
    const keyLen1 = Object.keys(obj1).length
    const keyLen2 = Object.keys(obj2).length
    if (keyLen1 === keyLen2) {
      for (let key in obj1) {
        if (!isObjEqual(obj1[key], obj2[key])) return false
      }
      return true
    }
    return false
  }
  return obj1 === obj2
}

export function formatUnit(val) {
  if (!isNaN(val)) {
    val += 'px'
  }
  return val
}

export function memo(func, thisArg = null) {
  let prevArgs, prevResult
  return function(...args) {
    if (prevArgs) {
      if (
        args.length === prevArgs.length &&
        args.every((arg, index) => arg === prevArgs[index])
      )
        return prevResult
    }
    prevArgs = args
    prevResult = func.apply(thisArg, args)
    return prevResult
  }
}

export function pad(str, padWith = '0', leastLen = 2) {
  return (
    Array.from({
      length: leastLen
    })
      .fill(padWith)
      .join('') +
    ('' + str)
  ).slice(-leastLen)
}

export function underlineToHump(name) {
  return name.replace(/\_(\w)/g, (all, letter) => {
    return letter.toUpperCase()
  })
}
