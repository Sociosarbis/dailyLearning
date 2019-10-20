const RETAIN = 'retain'
const INSERT = 'insert'
const DELETE = 'delete'

function calcMiddleSnake(A, a0, N, B, b0, M, VForward, VBackward) {
  const delta = N - M
  const maxD = Math.floor((N + M + 1) / 2)
  VForward[1] = 0
  VBackward[N - M - 1] = N
  const isOdd = Boolean(delta & 1)
  for (let d = 0; d <= maxD; d++) {
    for (let k = -d; k <= d; k += 2) {
      const down = k === -d || (k !== d && VForward[k - 1] < VForward[k + 1])
      const kPrev = down ? k + 1 : k - 1
      const startX = VForward[kPrev]
      const startY = startX - kPrev
      const midX = down ? startX : startX + 1
      const midY = midX - k
      let endX = midX
      let endY = midY
      while (endX < N && endY < M && A[a0 + endX] === B[b0 + endY]) {
        endX++
        endY++
      }
      VForward[k] = endX
      if (!isOdd || k < delta - (d - 1) || k > delta + (d - 1)) continue
      if (VForward[k] < VBackward[k]) continue
      return [2 * d - 1, down, startX, startY, midX, midY, endX, endY]
    }
    for (let k = -d + delta; k <= d + delta; k += 2) {
      const up = k === d + delta || (k !== -d + delta && VBackward[k - 1] < VBackward[k + 1])
      const kPrev = up ? k - 1 : k + 1
      const startX = VBackward[kPrev]
      const startY = startX - kPrev
      const midX = up ? startX : startX - 1
      const midY = midX - k
      let endX = midX
      let endY = midY
      while (endX > 0 && endY > 0 && A[a0 + endX - 1] === B[b0 + endY - 1]) {
        endX--
        endY--
      }
      VBackward[k] = endX
      if (isOdd || k < -d || k > d) continue
      if (VBackward[k] > VForward[k]) continue
      return [2 * d, up, endX, endY, midX, midY, startX, startY]
    }
  }
}

function innerDiff(A, a0, N, B, b0, M, VForward, VBackward) {
  let newOps = []
  if (M === 0 && N > 0) newOps = [[DELETE, N]]
  if (N === 0 && M > 0) newOps = [[INSERT, M]]
  if (M === 0 || N === 0) return newOps
  const middleSnake = calcMiddleSnake(A, a0, N, B, b0, M, VForward, VBackward)
  const startX = middleSnake[2]
  const startY = middleSnake[3]
  const midX = middleSnake[4]
  const midY = middleSnake[5]
  const endX = middleSnake[6]
  const endY = middleSnake[7]
  const D = middleSnake[0]
  const isVertical = middleSnake[1]
  const editOp = isVertical ? INSERT : DELETE
  const middleEditOps = []
  if (midY <= M && startX >= 0 && midX <= N && startY >= 0) {
    let editLength1 = isVertical ? midY - startY : midX - startX
    if (editLength1) middleEditOps.push([(midY - startY === midX - startX) ? RETAIN : editOp, editLength1])
  }
  if (midY >= 0 && endX <= N && midX >= 0 && endY <= M) {
    let editLength2 = isVertical ? endY - midY : endX - midX
    if (editLength2) middleEditOps.push([(endY - midY === endX - midX) ? RETAIN : editOp, editLength2])
  }
  if (D > 1) {
    newOps = innerDiff(A, a0, startX, B, b0, startY, VForward, VBackward)
    newOps.push(...middleEditOps)
    newOps.push(...innerDiff(A, a0 + endX, N - endX, B, b0 + endY, M - endY, VForward, VBackward))
  }
  else if (D === 0) newOps.push(...middleEditOps)
  else {
    if (startX) newOps.push([RETAIN, startX])
    newOps.push(...middleEditOps)
  }
  return newOps
}

function diff(A, B) {
  return innerDiff(A, 0, A.length, B, 0, B.length, [], [])
}