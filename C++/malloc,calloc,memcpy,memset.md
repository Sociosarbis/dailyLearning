## \<cstdlib\>
Allocates size bytes of uninitialized storage.
```c++
void* malloc( std::size_t size );
```
Allocates memory **for an array of num objects of size size** and **initializes it to all bits zero**.
```c++
void* calloc( std::size_t num, std::size_t size );
```
## \<cstring\>
Converts the value ch to unsigned char and copies it into each of the first count（首count个） characters of the object pointed to by dest.
```c++
void* memset( void* dest, int ch, std::size_t count );
```
Copies count bytes from the object pointed to by src to the object pointed to by dest.
```c++
void* memcpy( void* dest, const void* src, std::size_t count );
```
以上方法皆是将count个bytes以8bit为offset为0，步长为8bits填入
