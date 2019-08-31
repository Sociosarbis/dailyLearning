* **normal_matrix**解决的是当3D的对象进行了not uniform（不规整的）变化以后，对表面的法向量乘以同样的model matrix后，向量不再与表面垂直的问题。

**推导过程：N为normal vetor，G为normal matrix，M为model matrix，T为在平面上的向量。**

![](https://latex.codecogs.com/png.latex?%5Cbegin%7Balign*%7D%20%26N%5E%7BT%7DT%20%3D%20%28GN%29%5E%7BT%7DMT%20%3D%200%20%5C%5C%20%26N%5E%7BT%7DG%5E%7BT%7DMT%20%3D%200%20%5C%5C%20%26%5CRightarrow%20G%5E%7BT%7DM%20%3D%20E%20%5C%5C%20%26%5CRightarrow%20G%5E%7BT%7D%20%3D%20M%5E%7B-1%7D%20%5C%5C%20%26%5CRightarrow%20G%20%3D%20%28M%5E%7B-1%7D%29%5E%7BT%7D%5C%5C%20%5Cend%7Balign*%7D)
