const CODE_UNDEFINED = 946
const CODE_NULL = 443
function encodeStr(str) {
  return Array.prototype.reduce.call(
    str,
    function(code, s) {
      return code + (s + '').charCodeAt(0)
    },
    0
  )
}

function encodeArr(arr) {
  return Array.prototype.reduce.call(
    arr,
    function(code, el) {
      return code + encode(el)
    },
    0
  )
}

function encodeObj(obj) {
  let code = 0
  for (let key in obj) {
    code += encodeArr([key, obj[key]])
  }
  return code
}

/** transform any obj to string and encode them in charCode */
function encode(obj) {
  if (obj === undefined) return CODE_UNDEFINED
  if (obj === null) return CODE_NULL
  if (Number === obj.constructor) return encodeStr('' + obj)
  if (String === obj.constructor) return encodeStr(obj)
  if (Array === obj.constructor) return encodeArr(obj)
  return encodeObj(obj)
}

/**
 * @param {Object[]} left
 * @param {Object[]} right
 * @param {String} key
 * @description pre-sort left and right according to their value of key field,
 * then merge item in right to which has same value of key field in left
 */
function sortMerge(left, right, key) {
  if (
    left &&
    right &&
    left.constructor === Array &&
    right.constructor === Array
  ) {
    const newLeft = left
      .map(function(el) {
        return [encode(el && el[key]), el]
      })
      .sort(function(a, b) {
        return a[0] - b[0]
      })
    const newRight = right
      .map(function(el) {
        return [encode(el && el[key]), el]
      })
      .sort(function(a, b) {
        return a[0] - b[0]
      })
    let leftCursor = 0
    let rightCursor = 0
    while (leftCursor < newLeft.length && rightCursor < newRight.length) {
      newRight[rightCursor][0] < newLeft[leftCursor][0] && rightCursor++
      newRight[rightCursor][0] > newLeft[leftCursor][0] && leftCursor++
      newRight[rightCursor][0] === newLeft[leftCursor][0] &&
        (newLeft[leftCursor][1] &&
          Object.assign(newLeft[leftCursor][1], newRight[rightCursor][1]),
        leftCursor++,
        rightCursor++)
    }
  }
  return left
}
