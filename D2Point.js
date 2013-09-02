define('Geo/D2Point', [
  'objects/isArray',
  'Geo/refs',
  'Geo/Coordinate'
], function(isArray, refs, Coordinate) {

  var D2Point = function(a, b, o) {
    
    if (isArray(a)) {
      a.push('x');
      this.x = (new r.Coordinate(a));
    } else if (a.isCoordinate) {
      this.x = a;
    }

    if (isArray(b)) {
      b.push('y');
      this.y = (new r.Coordinate(b));
    } else if (b.isCoordinate) {
      this.y = b;
    }
  };

  D2Point.prototype = {

    isD2Point : true,

    isPoint : true,

    inRef : function(refName) {
      if (typeof refName === 'string') {
        refName = {
          x : refName,
          y : refName
        };
      } else if (isArray(refName)) {
        refName = {
          x : refName[0],
          y : refName[1]
        };
      }
      var c =  (new D2Point(this.x.inRef(refName.x), this.y.inRef(refName.y)));
      return c;
    },

    equals : function(p2) {
      var p2Bis = p2.inRef({ x : this.x.refName, y : this.y.refName});
      return this.getValue().equals(p2Bis.getValue());
    },
    
    getValue : function() {
      return [this.x.getValue(), this.y.getValue()];
    },

    multiply : function(f) {
      return (new D2Point(this.x.multiply(f), this.y.multiply(f)));
    },

    toArray : function(i) {
      if (typeof i !== 'undefined' ) {
        var dim = i === 0 ? 'x' : 'y';
        return this[dim];
      }
      return ([this.x,this.y]);
    },
    
    add : function(c2){
      var c2Bis;
      if(isArray(c2)){
        c2Bis = (new D2Point([c2[0], this.x.refName], [c2[1], this.y.refName]));
      } else {
        c2Bis = c2.inRef([this.x.refName, this.y.refName]);
      }
      return (new D2Point(this.x.add(c2Bis.x), this.y.add(c2Bis.y)));
    },

    minus : function(c2){
      var c2Bis;
      if(isArray(c2)){
        c2Bis = (new D2Point([c2[0], this.x.refName], [c2[1], this.y.refName]));
      } else {
        c2Bis = c2.inRef([this.x.refName, this.y.refName]);
      }
      return (new D2Point(this.x.minus(c2Bis.x), this.y.minus(c2Bis.y)));
    },
    
    clone : function() {
      return (new D2Point(this.x.clone(), this.y.clone()));
    }
    
  };

  return D2Point;

});