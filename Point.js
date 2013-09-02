define('Geo/Point', [
  'Geo/refs',
  'objects/isArray'
], function(refs, isArray) {
  
  
  var Point = function(options, refName) {
    if (typeof(options.x) !== 'undefined') {
      this.x = options.x;
      this.y = options.y;
    }
    else if (options.position) {
      this.x = options.position[0];
      this.y = options.position[1];
    }
    else {
      refName = refName || options[2] || 'window';
      this.x = options[0];
      this.y = options[1];
    }
    if (refName) {
      this.refName = refName;
    } else if(options.refName && options.refName.isRef){
      this.refName = options.refName.name || 'db';
    } else {
      this.refName = options.refName || 'db';
    }

  };
            
  Point.prototype = {
    
    isPoint : true,
    
    getValue : function() {
      return ([this.x, this.y]);
    },
    
    inRef : function(refName) {
      if (refName.isRef) {
        refName = refName.name;
      }
      if (this.refName !== refName) {
        var oRef = refs[this.refName];
        var nRef = refs[refName];

        var newO = nRef.origin;
        var oldO = oRef.origin;

        var dO = oldO.minus(newO);
        var factorX = oRef.factor[0] || oRef.factor;
        var factorY = oRef.factor[1] || oRef.factor;
        return (new Point({ x : (dO[0] + this.x/oRef.factor) * nRef.factor, y : (dO[1] + this.x/oRef.factor) * nRef.factor, refName : refName }));
      }

      return (this.clone());
            
    },
    
    multiply : function(f) {
      return (new Point({ x : this.x * f, y : this.y * f, refName : this.refName }));
    },
    
    add : function(p2){
      if(isArray(p2)){
        p2Bis = (new Point({x : p2[0], y : p2[1], refName : this.refName}));
      } else {
        p2Bis = p2.inRef(this.refName);
      }
      return (new Point({ x : this.x + p2Bis.x, y : this.y +p2Bis.y, refName : this.refName }));
    },

    minus : function(p2){
      var p2Bis;
      if(isArray(p2)){
        p2Bis = (new Point({x : p2[0], y : p2[1], refName : this.refName}));
      } else {
        p2Bis = p2.inRef(this.refName);
      }
      return (new Point({ x : this.x - p2Bis.x, y : this.y - p2Bis.y, refName : this.refName }));
    },
    
    clone : function() {
      return (new Point({ x : this.x, y : this.y, refName : this.refName }));
    },
    
    round : function(){
      return (new Point({ x : Math.round(this.x), y : Math.round(this.y), refName : this.refName }));
    }
  };
  
  return Point;
  
});
