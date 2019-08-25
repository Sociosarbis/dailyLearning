* 首先是声明输出变量，location的值对应于color buffer的序号
```c++
layout (location = 0) out vec4 FragColor;
layout (location = 1) out vec4 BrightColor; 
```
* 生成color buffer数组
```c++
unsigned int colorBuffers[2];
glGenTextures(2, colorBuffers);
```
* 将每个color buffer绑定到framebuffer上
```c++
for (unsigned int i = 0; i < 2; i++)
{
    /*
    ...
    */
    glFramebufferTexture2D(
        GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0 + i, GL_TEXTURE_2D, colorBuffers[i], 0
    );
} 
```
* color buffer会存储画面的像素数据
