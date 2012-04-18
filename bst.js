 Benchmark.prototype.setup = function() {
    var BinarySearchTree = function() {
      this.items = [];
    };
    
    BinarySearchTree.prototype = {
    
      leftChildIndex: function(index) {
        return index * 2;
      },
    
      rightChildIndex: function(index) {
        return index * 2 + 1;
      },
    
      getValueOf: function(index) {
    
        var candidate = this.items[index - 1];
    
        return (typeof candidate !== 'undefined' ? candidate : null);
      },
    
      add: function(item) {
    
        var node = 1;
    
        while (this.getValueOf(node) !== null) {
          if (this.getValueOf(node) > item) {
            node = this.leftChildIndex(node);
          } else {
            node = this.rightChildIndex(node);
          }
        }
    
        this.items[node - 1] = item;
    
      },
    
      find: function(item) {
        var node = 1;
    
        while (this.getValueOf(node) !== null) {
          if (this.getValueOf(node) > item) {
            node = this.leftChildIndex(node);
          } else if (this.getValueOf(node) < item) {
            node = this.rightChildIndex(node);
          } else {
            break;
          }
        }
    
        return this.getValueOf(node);
      }
    };
    
    // now set up the values
    var arr = [];
    var vals = [];
    var bst = new BinarySearchTree();
    
    for (var i = 0; i < 100000; i++) {
    
      candidate = Math.floor(Math.random() * 10000000);
    
      // we store the values in a separate
      // array just so it's outside of the other
      // data structures
      vals.push(candidate);
      arr.push(candidate);
      bst.add(candidate);
    
    }
  };