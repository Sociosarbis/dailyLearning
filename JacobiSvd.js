/** 
 * adapt from the code at http://www.math.pitt.edu/~sussmanm/2071Spring08/lab09/index.html
*/
function zeros(shape) {
  const nDim = shape.length
  if (nDim === 1) {
    return Array.from({ length: shape[0] }).fill(0)
  } else {
    const restDim = shape.slice(1)
    return Array.from({
      length: shape[0]
    }).map(function() {
      return zeros(restDim)
    })
  }
}

function eye(n) {
  return Array.from({ length: n }).map(function(_, i) {
    const row = Array.from({
      length: n
    }).fill(0)
    row[i] = 1
    return row
  })
}

function norm(vec) {
  return Math.sqrt(
    vec.reduce(function(res, n) {
      res += Math.pow(n, 2)
      return res
    }, 0)
  )
}

function diag(vec) {
  return Array.from({ length: vec.length }).map(function(_, i) {
    const row = Array.from({
      length: vec.length
    }).fill(0)
    row[i] = vec[i]
    return row
  })
}

/** 
 * Jacobi Rotation主要是定义一系列除了[i][i],[i][j],[j][i],[j][j] i=0...m-1, j=0...n-1 这几个位置和对角线外，其他位置为0的旋转矩阵Q
 * 迭代地进行 A' = Q.T · A · Q的变换，最终使A' = Diag (一个对角矩阵)
 * SVD的公式是 A = U · SIGMA · V.T
 * 算法一开始让 U = A, V = I 并对 (U.T · U)进行上述的旋转迭代
 * 具体的更新为 U' = U · Q, V' = V · I
 * 把更新带入迭代公式后会发现  Qk.T · ... Q.2.T · Q.1.T · A.T · A · Q1 · Q2 .... · Qk = Diag           (1)
 * 设A · Q1 · Q2 .... · Qk = M (2)
 * 则有M.T · M = Diag ->  设 Ds为对角阵 Ds · Ds = Diag, 则有 M.T · M  = Ds · Ds  -> Ds^-1 · M.T · M · Ds^-1 = I 由于对角阵的转置等于本身所以有 (Ds^-1).T · M.T · M · Ds^-1 = I
 * 令 U = M · Ds^-1 SIGMA对角线上元素对应Ds^-1对角线元素 V = Q1 · Q2 .... · Qk，由于Q.T · Q = I 易得 V.T · V = I 
 * 又U · SIGMA = A · Q1 · Q2 .... · Qk, V = Q1 · Q2 .... · Qk, U · SIGMA · V.T =  A · V · V.T = A 据此U,SIAGMA,V符合SVD定义
 * 
 * 
*/
function JacobiSvd(A) {
  const n = A[0].length
  const U = A.map(function(row) {
    return row.slice()
  })
  const singVals = Array.from({
    length: n
  })
  const TOL = 1e-8
  const V = eye(n)
  let converge = TOL + 1
  while (converge > TOL) {
    converge = 0
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        let alpha = 0
        let beta = 0
        let gamma = 0
        for (let k = 0; k < n; k++) {
          alpha += Math.pow(U[k][i], 2)
          beta += Math.pow(U[k][j], 2)
          gamma += U[k][i] * U[k][j]
        }
        converge = Math.max(converge, Math.abs(gamma) / Math.sqrt(alpha * beta))
        let zeta = (beta - alpha) / ((2 * gamma) || Number.EPSILON)
        let t =
          (Math.sign(zeta) || 1) /
          (Math.abs(zeta) + Math.sqrt(1 + Math.pow(zeta, 2)))
        let c = 1 / Math.sqrt(1 + Math.pow(t, 2))
        let s = c * t
        for (let k = 0; k < n; k++) {
          let t1 = U[k][i]
          U[k][i] = c * t1 - s * U[k][j]
          U[k][j] = s * t1 + c * U[k][j]
          let t2 = V[k][i]
          V[k][i] = c * t2 - s * V[k][j]
          V[k][j] = s * t2 + c * V[k][j]
        }
      }
    }
  }
  for (let j = 0; j < n; j++) {
    singVals[j] =
      norm(
        U.map(function(row) {
          return row[j]
        })
      ) || Number.EPSILON
    U.forEach(function(row) {
      row[j] /= singVals[j]
    })
  }
  S = diag(singVals)
  return [U, S, V]
}
