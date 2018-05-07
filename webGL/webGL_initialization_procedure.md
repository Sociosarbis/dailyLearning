```javascript
//dimen is the dimension of matrix both in row and column 
const canvas = document.createElement('canvas')
canvas.width = dimen
canvas.height = dimen
const gl = canvas.getContext('webgl2')
const program = gl.createProgram()
const vertexShader = gl.createShader(gl.VERTEX_SHADER)
//vsShaderCode is the source code of vertex shader
gl.shaderSource(vertexShader, vsShaderCode)
gl.compileShader(vertexShader)
gl.attachShader(program, vertexShader)
//the procedure to initialize fragmentShader is analogous to the code of vertex shader showed above
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
// ...
//links the given program to the attached vertex shader and fragment shader
gl.linkProgram(program)
//sets the specified program as part of the current rendering state
gl.useProgram(program)
gl.clearColor(.0, .0, .0, 1.)
gl.clear(gl.COLOR_BUFFER_BIT)
```
