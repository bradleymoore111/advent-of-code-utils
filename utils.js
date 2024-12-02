logging = true;
function log() {
    if (logging) console.log(...arguments);
}

function actualdata() {
    infcounter = 0;
    return document.getElementById("actualdata").value.trim();
}

function sampledata(n) {
    infcounter = 0;
    n ??= 1;

    return document.getElementById("sampledata" + n).value.trim();
}

var oldSplit = String.prototype.split;
String.prototype.split = function(a) {
    if (a == null) {
        return oldSplit.bind(this)(/\s+/g);
    }

    return oldSplit.bind(this)(a);
};

String.prototype.numSplit = function(a) {
    return this.split(a).map(e => +e);
}

Array.prototype.last = function() {
    return this[this.length-1];
}

Array.prototype.plus = function(other) {
    // Shallow copy!
    const a = [];
    for (let i=0; i<this.length && i<other.length; i++) {
        a.push(this[i] + other[i]);
    }
    return a;
}

Array.prototype.minus = function(other) {
    // Shallow copy!
    const a = [];
    for (let i=0; i<this.length && i<other.length; i++) {
        a.push(this[i] - other[i]);
    }
    return a;
}

Array.prototype.dot = function(other) {
    var sum = 0;
    for (let i=0; i<this.length && i<other.length; i++) {
        sum += this[i]*other[i];
    }
    return sum;
}

Array.prototype.cross = function(other) {
    if (this.length !== 2 || other.length !== 2) {
        throw "Not implemented error.";
    }

    return this[0] * other[1] - this[1] * other[0];
}

Array.prototype.times = function(n) {
    const a = [];
    for (let i=0; i<this.length; i++) {
        a.push(this[i] * n);
    }
    return a;
}

Array.prototype.equals = function(other) {
    if (this.length !== other.length) return false;
    for (let i=0; i<this.length; i++) {
        if (this[i] !== other[i]) return false;
    }
    return true;
}

Array.prototype.max = function() {
    return this.reduce((accum, curr) => Math.max(accum, curr), -Infinity);
}

Array.prototype.min = function() {
    return this.reduce((accum, curr) => Math.min(accum, curr), Infinity);
}

Array.prototype.sum = function() {
    return this.reduce((accum, curr) => accum + curr, 0);
}

Object.defineProperty(Array.prototype, "x", {
    get: function x() {
        return this[0];
    },
    set: function x(val) {
        this[0] = val;
    }
});

Object.defineProperty(Array.prototype, "y", {
    get: function y() {
        return this[1];
    },
    set: function y(val) {
        this[1] = val;
    }
});

const oldMapEntries = Map.prototype.entries;
Map.prototype.entries = function() {
    return [...(oldMapEntries.bind(this)())];
}

const oldMapValues = Map.prototype.values;
Map.prototype.values = function() {
    return [...(oldMapValues.bind(this)())];
}

const oldMapKeys = Map.prototype.keys;
Map.prototype.keys = function() {
    return [...(oldMapKeys.bind(this)())];
}

String.prototype.every = function(callback) {
    return this.split('').every(callback);
}

String.prototype.all = String.prototype.every;
Array.prototype.all = Array.prototype.every;

String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

function memoize(fn) {
    // Assume they're always primitives, strictly typed, and stringable.
    const memMap = new Map();

    return function() {
        const key = [...arguments].join('M'); // Hopefully this isn't ever a problem.
        if (!memMap.has(key)) memMap.set(key, fn(...arguments))
        return memMap.get(key);
    };
}

function hashPoint(p, y) {
    if (Array.isArray(p)) {
        return `${p[0]}&${p[1]}`;
    } else if (typeof p === 'object') {
        return `${p.x}&${p.y}`;
    } else {
        return `${p}&${y}`;
    }
}

function unhashPoint(p) {
    const parts = p.split('&');
    return {
        x: +parts[0],
        y: +parts[1],
    };
}

function unhashArrayPoint(p) {
    p = unhashPoint(p);
    return [p.x, p.y];
}

var infcounter = 0;

function infc() {
    if (infcounter++ < 1e5) return true;
    throw "infc failed.";
}

class Grid {
    constructor(input) {
        this._grid = (input ?? '').split('\n').map(e => e.split(''));
    }

    get width() {
        return this._grid[0].length;
    }

    get height() {
        return this._grid.length;
    }

    has(x, y) {
        return this.getCell(x, y) !== undefined;
    }

    cell(x, y) {
        return this.getCell(x, y);
    }

    getCell(x, y) {
        if (Array.isArray(x)) {
            y = x[1];
            x = x[0];
        }
        if (typeof x === 'object') {
            y = x.y;
            x = x.x;
        }

        const row = this._grid[this.height - y - 1];
        if (!row) return undefined;
        return row[x];
    }

    setCell(x, y, v) {
        if (Array.isArray(x)) {
            v = y;
            y = x[1];
            x = x[0];
        }
        if (typeof x === 'object') {
            v = y;
            y = x.y;
            x = x.x;
        }
        this._grid[this.height - y - 1][x] = v;
    }

    insertRow(yIndex, value) {
        let a = [];
        for (let i=0; i<this.width; i++) {
            a.push(value ?? null);
        }
        // NO MINUS ONE strictly because we're going in opposite direction or something idk.
        this._grid.splice(this.height - yIndex, 0, a);
    }

    insertCol(xIndex, value) {
        for (let i=0; i<this.height; i++) {
            this._grid[i].splice(xIndex, 0, value ?? null);
        }
    }

    removeRow(yIndex) {
        this._grid.splice(this.height - yIndex - 1, 1);
    }

    removeCol(xIndex) {
        for (let i=0; i<this.height; i++) {
            this._grid[i].splice(xIndex, 1);
        }
    }

    dump() {
        log(`Grid(${this.width} x ${this.height})\n${this.toString()}`);
    }

    toString() {
        const rows = [];
        for (let y=this.height - 1; y>=0; y--) {
            let s = '';
            for (let x=0; x<this.width; x++) {
                s += this.cell(x, y);
            }
            rows.push(s);
        }
        return rows.join('\n');
    }

    row(n) {
        return [...this._grid[this.height - n - 1]];
    }

    col(n) {
        // console.log("   Getting col:", n);
        var vals = [];
        for (let y=0; y<this.height; y++) {
            vals.push(this.cell(n, y));
        }
        return vals;
    }

    [Symbol.iterator] = function() {
        let x=0;
        let y=0;

        return {
            next: () => {
                if (y >= this.height) {
                    return {done: true};
                }
                const value = {point: {x, y}, value: this.cell(x, y)};

                x++;
                if (x >= this.width) {
                    x = 0;
                    y++;
                }

                return {value, done: false};
            }
        };
    }

    arrayPoints() {
        return {
            [Symbol.iterator]: () => {
                let x=0;
                let y=0;
        
                return {
                    next: () => {
                        if (y >= this.height) {
                            return {done: true};
                        }

                        const value = {point: [x, y], value: this.cell(x, y)};
        
                        x++;
                        if (x >= this.width) {
                            x = 0;
                            y++;
                        }

                        return {value, done: false};
                    }
                };
            }
        }
    }
}

