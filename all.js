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

const oldMapEntries = Map.prototype.entries;
Map.prototype.entries = function() {
    return [...(oldMapEntries.bind(this)())];
}

var infcounter = 0;

function infc() {
    return infcounter++ < 1e8;
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

    dump() {
        let s = '';
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