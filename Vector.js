(define('Geo/Vector', [
  'objects/extend',
  'Geo/Point',
  'Geo/refs'
], function(extend, Point, refs) {
    
  var Vector = function(options) {
    Point.call(this, options)
  };
    
  extend(Vector.prototype, Point.prototype, {    

    isPoint : undefined,
    
    isVector : true,
    
    inRef : function(refName) {
      if(this.refName !== refName) {
        return (new Vector({ x : this.x * refs  [refName].factor/refs[this.refName].factor, y : this.y * refs[refName].factor/refs[this.refName].factor, refName : refName, refsPath : refs }));
      }
      else {
        return this.clone();
      }
    },
    
    clone : function() {
      return (new Vector({ x : this.x, y : this.y,  refName : this.refName, refsPath : this.refsPath }));
    }

  });
            
  return Vector;
    
}));