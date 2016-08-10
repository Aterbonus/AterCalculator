/*jslint plusplus: true */
/*Copyright (c) 2016 Gustavo Alfredo Marín Sáez
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.*/
var AterCalculator = (function () {

    'use strict';

    function Calculator() {
        this.binaryMinus = '-';
        this.unaryMinus = '#';
        this.decimals = 7;

        this.operators = {
            '+': {
                operands: 2,
                precedence: 1,
                associativity: 'l',
                func: function (a, b) {
                    return a + b;
                }
            },
            '-': {
                operands: 2,
                precedence: 1,
                associativity: 'l',
                func: function (a, b) {
                    return a - b;
                }
            },
            '*': {
                operands: 2,
                precedence: 2,
                associativity: 'l',
                func: function (a, b) {
                    return a * b;
                }
            },
            '/': {
                operands: 2,
                precedence: 2,
                associativity: 'l',
                func: function (a, b) {
                    if (b === 0) {
                        throw 'Do you want to destroy the universe?';
                    }
                    return a / b;
                }
            },
            '^': {
                operands: 2,
                precedence: 3,
                associativity: 'r',
                func: function (a, b) {
                    return Math.pow(a, b);
                }
            },
            '#': {
                operands: 1,
                precedence: 10,
                associativity: 'r',
                func: function (a) {
                    return -a;
                }
            }
        };

        this.functions = {
            sin: {
                operands: 1,
                func: function (a) {
                    return Math.sin(this.toRadians(a)).toFixed(this.decimals);
                }
            },
            cos: {
                operands: 1,
                func: function (a) {
                    return Math.cos(this.toRadians(a)).toFixed(this.decimals);
                }
            },
            tan: {
                operands: 1,
                func: function (a) {
                    return Math.tan(this.toRadians(a)).toFixed(this.decimals);
                }
            },
            asin: {
                operands: 1,
                func: function (a) {
                    return this.toDegrees(Math.asin(a)).toFixed(this.decimals);
                }
            },
            acos: {
                operands: 1,
                func: function (a) {
                    return this.toDegrees(Math.acos(a)).toFixed(this.decimals);
                }
            },
            atan: {
                operands: 1,
                func: function (a) {
                    return this.toDegrees(Math.atan(a)).toFixed(this.decimals);
                }
            },
            sqrt: {
                operands: 1,
                func: function (a) {
                    return Math.sqrt(a).toFixed(this.decimals);
                }
            },
            nrt: {
                operands: 2,
                func: function (n, x) {
                    return Math.pow(10, (Math.log(x) / Math.log(10)) / n).toFixed(this.decimals);
                }
            }
        };

        this.symbols = {
            'pi': Math.PI,
            'e': Math.E,
            'π': Math.PI
        };
    }

    Calculator.prototype.toRadians = function (degrees) {
        return degrees * (Math.PI / 180);
    };

    Calculator.prototype.toDegrees = function (radians) {
        return radians * (180 / Math.PI);
    };

    Calculator.prototype.setUnaryMinusSymbol = function (newSymbol) {
        var oldSymbol = this.unaryMinus;
        if (newSymbol === oldSymbol) {
            return;
        }
        this.unaryMinus = newSymbol;
        this.operators[newSymbol] = this.operators[oldSymbol];
        delete this.operators[oldSymbol];
    };

    Calculator.prototype.setBinaryMinusSymbol = function (newSymbol) {
        var oldSymbol = this.bynaryMinus;
        if (newSymbol === oldSymbol) {
            return;
        }
        this.binaryMinus = newSymbol;
        this.operators[newSymbol] = this.operators[oldSymbol];
        delete this.operators[oldSymbol];
    };

    Calculator.prototype.solve = function (string) {
        return this.solveReversePolishNotation(this.shuntingYard(this.parseUnaryMinus(string)));
    };

    Calculator.prototype.parseUnaryMinus = function (string) {

        var zeroCharCode = '0'.charCodeAt(0),
            nineCharCode = '9'.charCodeAt(0),
            that = this;

        return string.replace(/\s/g, '').replace(new RegExp(this._regexEncode(this.binaryMinus), 'g'), function (match, offset, string) {
            if (offset === 0) {
                return that.unaryMinus;
            }
            var charCode = string[offset - 1].charCodeAt(0);
            return (charCode < zeroCharCode || charCode > nineCharCode) && string[offset - 1] !== ')' ? that.unaryMinus : that.binaryMinus;
        });

    };

    Calculator.prototype.shuntingYard = function (string) {

        var operators = this.operators,
            functions = this.functions,
            symbols = this.symbols,
            operatorsString = Object.keys(operators).map(this._regexEncode).sort(this._regexSort).join('|'),
            functionsString = Object.keys(functions).map(this._regexEncode).sort(this._regexSort).join('|'),
            symbolsString = Object.keys(symbols).map(this._regexEncode).sort(this._regexSort).join('|'),
            tokens = string.match(new RegExp('\\d+(?:[\\.]\\d+)?(?:[eE]\\d+)?|[()]' + (operatorsString.length > 0 ? '|' + operatorsString : '') + (functionsString.length > 0 ? '|' + functionsString : '') + (symbolsString.length > 0 ? '|' + symbolsString : ''), 'g')),
            output = [],
            stack = [],
            token,
            operator,
            aux,
            i,
            j,
            length;

        for (i = 0, length = tokens.length; i < length; i++) {
            token = tokens[i];
            if (functions[token]) {
                stack.push(token);
            } else if (token === ',') {
                while (stack.length > 0 && stack[stack.length - 1] !== '(') {
                    output.push(stack.pop());
                }
                if (stack.length === 0) {
                    throw 'A separator(,) was misplaced or parentheses were mismatched';
                }
            } else if (operators[token]) {
                operator = operators[token];
                while (typeof operators[stack[stack.length - 1]] !== 'undefined' && ((operator.associativity === 'l' && operator.precedence <= operators[stack[stack.length - 1]].precedence) || (operator.associativity === 'r' && operator.precedence < operators[stack[stack.length - 1]].precedence))) {
                    output.push(stack.pop());
                }
                stack.push(token);
            } else if (token === '(') {
                stack.push(token);
            } else if (token === ')') {
                while ((aux = stack.pop()) !== '(' && typeof aux !== 'undefined') {
                    output.push(aux);
                }
                if (functions[stack[stack.length - 1]]) {
                    output.push(stack.pop());
                }
                if (aux !== '(') {
                    throw 'Mismatched parentheses.';
                }
            } else {
                output.push(token);
            }
        }

        while (typeof (aux = stack.pop()) !== 'undefined') {
            if ('(' === aux || ')' === aux) {
                throw 'Mismatched parentheses.';
            }
            output.push(aux);
        }

        return output;

    };

    Calculator.prototype._regexEncode = function (string) {
        return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    };

    Calculator.prototype._regexSort = function (a, b) {
        return a.length - b.length;
    };

    Calculator.prototype.solveReversePolishNotation = function (tokens) {

        var operators = this.operators,
            functions = this.functions,
            symbols = this.symbols,
            resultStack = [],
            args = [],
            token,
            operator,
            i,
            length,
            j,
            l;

        for (i = 0, length = tokens.length; i < length; i++) {
            token = tokens[i];
            if (typeof (operator = operators[token] || functions[token]) !== 'undefined') {
                if (resultStack.length < operator.operands) {
                    throw 'Insufficient values in the expression.';
                }
                for (l = resultStack.length, j = l - operator.operands; j < l; j++) {
                    args.push(resultStack[j]);
                }
                resultStack.length = resultStack.length - operator.operands;
                resultStack.push(+operator.func.apply(this, args));
                args.length = 0;
            } else {
                resultStack.push(typeof symbols[token] !== 'undefined' ? symbols[token] : +token);
            }
        }
        if (resultStack.length !== 1) {
            throw 'Too many values in the expression.';
        }

        return resultStack.pop();

    };

    return Calculator;

}());
