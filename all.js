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

var infcounter = 0;

function infc() {
    return infcounter++ < 1e8;
}