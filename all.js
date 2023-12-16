logging = true;
function log() {
    if (logging) console.log(...arguments);
}

var oldSplit = String.prototype.split;
String.prototype.split = function(a) {
    if (a == null) {
        return oldSplit.bind(this)(/\s+/g);
    }

    return oldSplit.bind(this)(a);
};

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

Array.prototype.max = function() {
    return this.reduce((accum, curr) => Math.max(accum, curr), -Infinity);
}

Array.prototype.min = function() {
    return this.reduce((accum, curr) => Math.min(accum, curr), Infinity);
}

Array.prototype.sum = function() {
    return this.reduce((accum, curr) => accum + curr, 0);
}

const oldMapEntries = Map.prototype.entries;
Map.prototype.entries = function() {
    return [...(oldMapEntries.bind(this)())];
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
        if (!memMap.has(key)) {
            memMap.set(key, fn(...arguments));
        } else {
            "Cache hit.";
        }
        return memMap.get(key);
    };
}

var infcounter = 0;

function infc() {
    return infcounter++ < 1e5;
}

function actualdata() {
    return document.getElementById("actualdata").value.trim();
}

function sampledata(n) {
    n ??= 1;

    return document.getElementById("sampledata" + n).value.trim();
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
        let s = `Grid(${this.width} x ${this.height})\n`;
        for (let y=this.height - 1; y>=0; y--) {
            for (let x=0; x<this.width; x++) {
                s += this.cell(x, y);
            }
            s += '\n';
        }

        console.log(s);
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