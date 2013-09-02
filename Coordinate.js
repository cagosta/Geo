define('Geo/Coordinate', [
	'objects/isArray',
	'Geo/refs'
], function(isArray, refs) {

	var Coordinate = function(o, refName, dimension) {
		if (isArray(o)) {
			this.x = o[0];
			this.refName = o[1];
			this.dimension = o[2];
		} else {
			this.x = o;
			this.refName = refName;
			this.dimension = dimension;
		}
		if (typeof this.dimension === 'number') {
			this.dimension = this.dimension === 1 ? 'y' : 'x';
		}
		this.refName = this.refName || 'db';
	};

            
  Coordinate.prototype = {
    
    isCoordinate : true,
    
    getValue : function() {
      return (this.x);
    },

    toArray : function() {
      return [this.x, this.refName, this.dimension];
    },
    
    inRef : function(refName) {
      if (refName.isRef) {
        refName = refName.name;
      }
      if (this.refName !== refName) {
        var oRef = refs[this.refName];
        var nRef = refs[refName];
        var i = this.dimension === 'x' ? 0 : 1;
        var newO = nRef.origin[i];
        var oldO = oRef.origin[i];

        var dO = oldO - newO;
        var nFactor = nRef.factor[i] || nRef.factor,
						oFactor = oRef.factor[i] || oRef.factor;
        return (new Coordinate( (dO + this.x/oFactor) * nFactor, refName, this.dimension));
      }
      return (this.clone());
    },
    
    multiply : function(f) {
      return (new Coordinate(this.x*f,this.refName, this.dimension));
    },
    
    add : function(p2){
      if(typeof p2 === "number"){
        p2Bis = (new Coordinate(p2, this.refName, this.dimension));
      } else {
        p2Bis = p2.inRef(this.refName);
      }
      return (new Coordinate(this.x + p2Bis.x, this.refName, this.dimension));
    },

    minus : function(p2){
      var p2Bis;
      if(typeof p2 == "number"){
        p2Bis = (new Coordinate(p2, this.refName, this.dimension));
      } else {
        p2Bis = p2.inRef(this.refName);
      }
      return (new Coordinate(this.x - p2Bis.x, this.refName, this.dimension));
    },
    
    clone : function() {
      return (new Coordinate(this.x, this.refName, this.dimension));
    }

  };

  return Coordinate;

});