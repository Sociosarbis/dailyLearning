```c++
//先获取uniform block在shader program中的index
GLuint glGetUniformBlockIndex(GLuint program, const GLchar *uniformBlockName);
//通过第一步拿到的index，将shader program中对应的uniform block设置到binding point上
void glUniformBlockBinding(GLuint program, GLuint uniformBlockIndex, GLuint uniformBlockBinding);
//创建buffer
void glGenBuffers(GLsizei size, GLint* buffers);
//绑定buffer到GL_UNIFORM_BUFFER target上
void glBindBuffer(GLenum target, GLint buffer);
//填充数据到buffer中
void glBufferData(GLenum mode, GLsizeiptr size, const GLvoid* data, GLEnum usage);
//定义将哪部分buffer的数据连接到binding point上
void glBindBufferRange(GLenum target, GLuint index, GLuint buffer, GLintptr offset, GLsizeiptr size);
//或者将整个buffer连接
void glBindBufferBase(GLenum target, GLuint index, GLuint buffer);
//当需要更新部分数据时
void glBindBuffer(GLenum target, GLint buffer);
void glBufferSubData(GLenum mode, GLintptr offset, GLsizeiptr size, const GLvoid* data)
```
