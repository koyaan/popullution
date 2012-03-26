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
    idx = this.members.indexOf(value);
    if(idx != -1) {
        this.members.splice(idx, 1);
        if(this.members.length == 0)    {
            this.active = false;
            cellIdx = this.celllist.activeCells.indexOf(this);
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
    
    for(x = 0; x<=this.size; x++) {
        this.cells[x] = new Array();
        for(y = 0; y<=this.size; y++ ) {
            this.cells[x][y] = new Array();
            for(z = 0;  z<=this.size; z++) {
                this.cells[x][y][z] = new CELLLIST.Cell(this);
            }
        }
    }
}


CELLLIST.Cube.prototype.add = function (x,y,z,value) {
    xx = x+this.normalizer;
    yy = y+this.normalizer;
    zz = z+this.normalizer;

    this.cells[xx][yy][zz].push(value);
};


CELLLIST.Cube.prototype.get = function (x,y,z) {
    xx = x+this.normalizer;
    yy  = y+this.normalizer;
    zz = z+this.normalizer;
    
    return this.cells[xx][yy][zz].get();
}

CELLLIST.Cube.prototype.remove = function (x,y,z,value) {
    xx = x+this.normalizer;
    yy = y+this.normalizer;
    zz = z+this.normalizer;
//    console.log(xx,yy,zz);
    this.cells[xx][yy][zz].remove(value);
}

CELLLIST.Cube.prototype.computeNeighbors = function()   {    
    for(x = 0; x<=this.size; x++) {
        for(y = 0; y<=this.size; y++ ) {
            for(z = 0;  z<=this.size; z++) {
                this.cells[x][y][z].neighbors = this.getNeighbors(x, y, z);
            }
        }
    }
}

CELLLIST.Cube.prototype.getNeighbors = function (x,y,z) {

    var neighbors = new Array();
    
    xStart = x > 0 ? x -1 : x;
    xEnd = x < this.cells.length-1 ? x+1 : x;
    yStart = y > 0 ? y -1 : y;
    yEnd = y < this.cells.length-1 ? y+1 : y;
    zStart = z > 0 ? z -1 : z;
    zEnd = z < this.cells.length-1 ? z+1 : z;
    
    for(x = xStart; x <= xEnd; x++) {
        for(y = yStart; y <= yEnd; y++) {
            for(z = zStart; z <= zEnd; z++) {
                neighbors.push(this.cells[x][y][z]);
            }
        }
    }
    
    return neighbors;
}