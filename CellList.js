CELLLIST = {};

CELLLIST.Cell = function(celllist) {
    this.active = false;
    this.members = new Array();
    this.neighbors = false;
    this.celllist = celllist;
}

CELLLIST.Cell.prototype.push = function(value)  {
    if(!this.active) {
        this.active = true;
        this.celllist.activeCells.push(this);
    }
    
    this.members.push(value);
}

CELLLIST.Cell.prototype.get = function()  {
    return this.members;
}

CELLLIST.Cell.prototype.remove = function(value)  {
    var idx = this.members.indexOf(value);
    if(idx != -1) {
        this.members.splice(idx, 1);
        if(this.members.length == 0)    {
            this.active = false;
            var cellIdx = this.celllist.activeCells.indexOf(this);
            if(cellIdx != -1) {
                this.celllist.activeCells.splice(cellIdx,1);
            }
        }
    }
}

CELLLIST.Cube  = function(size,negativeIndices) {
    this.negativeIndices = ( negativeIndices !== undefined ) ? negativeIndices : true;
    this.size = ( size !== undefined ) ? (this.negativeIndices && size % 2 ? size+1 : size ) : 100;
    this.normalizer = this.size/2;
    
    this.cells = new Array();
    this.activeCells = new Array;
    
    for(var x = 0; x<=this.size; x++) {
        this.cells[x] = new Array();
        for(var y = 0; y<=this.size; y++ ) {
            this.cells[x][y] = new Array();
            for(var z = 0;  z<=this.size; z++) {
                this.cells[x][y][z] = new CELLLIST.Cell(this);
            }
        }
    }
}


CELLLIST.Cube.prototype.add = function (x,y,z,value) {
    this.cells[x+this.normalizer][y+this.normalizer][z+this.normalizer].push(value);
};


CELLLIST.Cube.prototype.get = function (x,y,z) {
    return this.cells[x+this.normalizer][y+this.normalizer][z+this.normalizer].get();
}

CELLLIST.Cube.prototype.remove = function (x,y,z,value) {
    this.cells[x+this.normalizer][y+this.normalizer][z+this.normalizer].remove(value);
}

CELLLIST.Cube.prototype.computeNeighbors = function()   {    
    for(var x = 0; x<=this.size; x++) {
        for(var y = 0; y<=this.size; y++ ) {
            for(var z = 0;  z<=this.size; z++) {
                this.cells[x][y][z].neighbors = this.getNeighbors(x, y, z);
            }
        }
    }
}

CELLLIST.Cube.prototype.getNeighbors = function (x,y,z) {

    var neighbors = new Array();
    
    var xStart = x > 0 ? x -1 : x;
    var xEnd = x < this.cells.length-1 ? x+1 : x;
    var yStart = y > 0 ? y -1 : y;
    var yEnd = y < this.cells.length-1 ? y+1 : y;
    var zStart = z > 0 ? z -1 : z;
    var zEnd = z < this.cells.length-1 ? z+1 : z;
    
    for(x = xStart; x <= xEnd; x++) {
        for(y = yStart; y <= yEnd; y++) {
            for(z = zStart; z <= zEnd; z++) {
                neighbors.push(this.cells[x][y][z]);
            }
        }
    }
    
    return neighbors;
}