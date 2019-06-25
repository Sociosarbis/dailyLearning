### Law of consines:
![Law of consines](https://latex.codecogs.com/gif.latex?c%5E%7B2%7D%20%3D%20a%5E%7B2%7D%20&plus;%20b%5E%7B2%7D%20-%202ab%5Ccos%20%5Cgamma "Law of consines")
```javascript
function angleGamma(a, b, c) {
	return Math.acos((Math.pow(a, 2) + Math.pow(b,2) - Math.pow(c, 2)) / (2 * a * b));
}
```
