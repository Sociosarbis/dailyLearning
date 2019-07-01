## 1.开启混合:
```c++
glEnable(GL_BLEND);
```
## 2.设置混合因子：
```c++
glBlendFunc(GLenum sfactor, GLenum dfactor);
```
### 可选择常量因子：
|Option|Value|
|------|-----|
|GL_ZERO|0.|
|GL_ONE|1.|
|GL_SRC_COLOR|![GL_SRC_COLOR](https://latex.codecogs.com/png.latex?%5Cbar%7BC%7D_%7Bsource%7D "GL_SRC_COLOR").|
|GL_ONE_MINUS_SRC_COLOR|![GL_ONE_MINUS_SRC_COLOR](https://latex.codecogs.com/png.latex?1%20-%20%5Cbar%7BC%7D_%7Bsource%7D "GL_ONE_MINUS_SRC_COLOR"). |
|GL_DST_COLOR|![GL_DST_COLOR](https://latex.codecogs.com/png.latex?%5Cbar%7BC%7D_%7Bdestination%7D "GL_DST_COLOR").|
|GL_ONE_MINUS_DST_COLOR|![GL_ONE_MINUS_DST_COLOR](https://latex.codecogs.com/png.latex?1%20-%20%5Cbar%7BC%7D_%7Bdestination%7D "GL_ONE_MINUS_DST_COLOR").|
|GL_SRC_ALPHA|![GL_SRC_ALPHA](https://latex.codecogs.com/png.latex?alpha%20%5Cin%20%5Cbar%7BC%7D_%7Bsource%7D "GL_SRC_ALPHA").  |
|GL_ONE_MINUS_SRC_ALPHA|![GL_ONE_MINUS_SRC_ALPHA](https://latex.codecogs.com/png.latex?1%20-%20alpha%20%5Cin%20%5Cbar%7BC%7D_%7Bsource%7D "GL_ONE_MINUS_SRC_ALPHA").|
|GL_DST_ALPHA|![GL_DST_ALPHA](https://latex.codecogs.com/png.latex?alpha%20%5Cin%20%5Cbar%7BC%7D_%7Bdestination%7D "GL_DST_ALPHA").  |
|GL_ONE_MINUS_DST_ALPHA|![GL_ONE_MINUS_SRC_ALPHA](https://latex.codecogs.com/png.latex?1%20-%20alpha%20%5Cin%20%5Cbar%7BC%7D_%7Bdestination%7D "GL_ONE_MINUS_SRC_ALPHA").|
|GL_CONSTANT_COLOR|![GL_CONSTANT_COLOR](https://latex.codecogs.com/png.latex?%5Cbar%7BC%7D_%7Bconstant%7D "GL_CONSTANT_COLOR").  |
|GL_ONE_MINUS_CONSTANT_COLOR|![GL_ONE_MINUS_CONSTANT_COLOR](https://latex.codecogs.com/png.latex?1%20-%20%5Cbar%7BC%7D_%7Bconstant%7D "GL_ONE_MINUS_CONSTANT_COLOR").|
|GL_CONSTANT_ALPHA|![GL_ONE_MINUS_CONSTANT_COLOR](https://latex.codecogs.com/png.latex?1%20-%20%5Cbar%7BC%7D_%7Bconstant%7D "GL_ONE_MINUS_CONSTANT_COLOR")  |
|GL_ONE_MINUS_CONSTANT_ALPHA|![GL_ONE_MINUS_CONSTANT_ALPHA](https://latex.codecogs.com/png.latex?1%20-%20alpha%20%5Cin%20%5Cbar%7BC%7D_%7Bconstant%7D "GL_ONE_MINUS_CONSTANT_ALPHA").|
### 对RGB channel 和 alpha channel分别设置：
```c++
glBlendFuncSeparate(GLenum srcRGB, GLenum dstRGB, GLenum srcAlpha, GLenum dstAlpha);
```
### 3.设置源颜色和目标颜色的混合操作符：
```c++
glBlendEquation(GLenum mode);
```
|Option|Value|
|------|-----|
|GL_FUNC_ADD|![GL_FUNC_ADD](https://latex.codecogs.com/png.latex?%5Cbar%7BC%7D_%7Bresult%7D%3DSrc%20&plus;%20Dst "GL_FUNC_ADD")|
|GL_FUNC_SUBTRACT|![GL_FUNC_SUBTRACT](https://latex.codecogs.com/png.latex?%5Cbar%7BC%7D_%7Bresult%7D%3DSrc%20-%20Dst "GL_FUNC_SUBTRACT")|
|GL_FUNC_REVERSE_SUBTRACT|![GL_FUNC_REVERSE_SUBTRACT](https://latex.codecogs.com/png.latex?%5Cbar%7BC%7D_%7Bresult%7D%3DDst%20-%20Src "GL_FUNC_REVERSE_SUBTRACT")|
### 3.设置混合因子中的constant color：
```c++
glBlendColor(GLclampf red, GLclampf green, GLclampf blue, GLclampf alpha);
```
