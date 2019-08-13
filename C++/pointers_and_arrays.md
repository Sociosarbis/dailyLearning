1. int *a[5]和int (*a)[5]的区别在于前者表示5个**指向int类型的指针**，后者表示1**个指向有5个**元素数组的指针**
2. const与*的放置位置产生的不同意思，遵循从后往前读的原则
    1. int* - 整数的指针
    2. int const * - 整数常量的指针
    3. int * const - 整数的指针常量
    4. int const * const - 整数常量的指针常量
    5. 其中const int * == int const *和const int * const == int const * const
