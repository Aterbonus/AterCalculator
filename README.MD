#AterCalculator

A JavaScript Calculator that uses the [Reverse Polish Notation](https://en.wikipedia.org/wiki/Reverse_Polish_notation) and the [Shunting-yard Algorithm](https://en.wikipedia.org/wiki/Shunting-yard_algorithm) to solve problems.

#How to use it

##Solving a human-readable problem

```javascript
var c = new AterCalculator();
c.solve('5^3+(-(6-8)*sqrt(4^3))-3/6');//140.5
```

##Parse unary minus

```javascript
c.parseUnaryMinus('-1-2(-3-4)-5+-6---7');//#1-2(#3-4)-5+#6-##7
```

Note: This method strips white spaces.

##Get an array of Shunting-yard tokens from a human-readable problem

```javascript
c.shuntingYard('5^3+(#(6-8)*sqrt(4^3))-3/6');//[5, 3, "^", 6, 8, "-", "#", 4, 3, "^", "sqrt", "*", "+", 3, 6, "/", "-"]
```

Note: You have to use the # to represent the unary minus. If you don't and try to use the output in
the **solveReversePolishNotation** method it will throw an exception.

##Solving a Reverse Polish Notation array

```javascript
c.solveReversePolishNotation([5, 3, "^", 6, 8, "-", "#", 4, 3, "^", "sqrt", "*", "+", 3, 6, "/", "-"]);//140.5
```

##Customising the Calculator

###Adding a new operator

```javascript
c.operators['~'] = {
    operands: 1,
    associativity: 'r',
    precedence: 10,
    func: function(a) {
        return ~a;
    }
};
c.solve('~4');//-5
```

###Structure of operators

|Attribute|Explanation|Values|
|:---:|:---:|:---:|
|operands|Number of arguments that **func** needs. This correspond to the number of operands to operate.|1 or 2|
|associativity|Associativity of the operator.|'l' or 'r' for left or right respectively|
|precedence|Precedence of the operator. A greater number indicates a greater priority.|An integer|
|func|The function definition of the operator.|A function with a number of parameters equal to **operands** attribute|

###Adding a new function

```javascript
c.functions['myFunc'] = {
    operands: 2,
    func: function(a, b) {
        return a*2-b;
    }
};
c.solve('myFunc(5, 3)');//7
```

###Structure of functions

|Attribute|Explanation|Values|
|:---:|:---:|:---:|
|operands|Number of arguments that **func** needs.|An integer from 0 to ...|
|func|The function definition.|A function with a number of parameters equal to **operands** attribute|

###Calculator internal attributes

* decimals: Number of decimals returned by built-in trigonometric functions
* unaryMinus: Unary minus operator symbol
* binaryMinus: Binary minus (Sustraction) operator symbol

Note: Changing unaryMinus or binaryMinus changes the behaviour of **parseUnaryMinus** only (And because of that, 
the behaviour of the **solve** method).

Prefer using the **setUnaryMinusSymbol** and **setBinaryMinusSymbol** methods instead.

```javascript
c.setUnaryMinusSymbol('%');
c.solve('#1');//1
c.solve('%1');//-1
```

##Catching errors

```javascript
try {
   console.log(c.resolveReversePolishNotation(c.shuntingYard('5^3+(-(6-8)*sqrt(4^3))-3/6')));
} catch(e) {
   console.log(e);//"Insufficient values in the expression."
}
```

This error is thrown because the "-" operator is binary and expects 2 operands in `-(6-8)`. Use # instead `#(6-8)`.

#Built-in Operations

##Operators

|Operation|Symbol|Operands|Precedence|Associativity|
|:---:|:---:|:---:|:---:|:---:|
|Addition|+|2|1|Left|
|Sustraction|-|2|1|Left|
|Multiplication|*|2|2|Left|
|Division|/|2|2|Left|
|Exponentiation|^|2|3|Right
|Unary Minus|- (Context-dependent) <br> # (Explicit unary minus)|1|10|Right|

##Functions

|Function|Notation|Operands|
|:---:|:---:|:---:|
|Sine|sin|1|
|Cosine|cos|1|
|Tangent|tan|1|
|Arcsine|asin|1|
|Arccosine|acos|1|
|Arctangent|atan|1|
|Square root|sqrt|1|

Note: The built-in trigonometric functions expect and return angles in degrees.

#License

Copyright (c) 2016 Gustavo Alfredo Marín Sáez

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
