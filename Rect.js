(define('Geo/Rect', [
  'Geo/R4',
  'objects/extend',
  'Geo/refs',
  'Geo/Seg',
  'Geo/Point'
], function(R4, extend, refs, Seg, Point) {

  var Rect = function(options, refName) {
    R4.call(this, options);

    if(!options.refName && !refName) {
        this.refName = 'db';
    }
    else {
      if(options.refName && options.refName.isRef){
        this.refName = options.refName.name;
      } else {
        this.refName = options.refName || refName;
      }
    }
  };

  extend(Rect.prototype, R4.prototype,{

    isRect : true,

    inRef : function(options) {
        var nRefName = options.name || options;

        var oRef = refs[this.refName];
        var nRef = refs[nRefName];

        var nOrigin = nRef.origin;
        var nFactor = nRef.factor;

        //var rounded = options.rounded || true;

        var nSegX, nSegY;

        var oFactor = oRef.factor;
        var oOrigin = oRef.origin;

        if(typeof(oFactor) === 'number') {
            oFactor = [oFactor, oFactor];
        }
         if(typeof(nFactor) === 'number') {
             nFactor = [nFactor, nFactor];
         }

        var dFactor = [nFactor[0]/oFactor[0], nFactor[1]/oFactor[1]];

        var dOrigin = [oFactor[0]*(nOrigin[0]-oOrigin[0]), oFactor[1]*(nOrigin[1]-oOrigin[1])]; // new origin

        if(options.override) {
            this.segX.add(-dOrigin[0]);
            this.segY.add(-dOrigin[1]);
            this.segX.multiply(dFactor[0]);
            this.segY.multiply(dFactor[1]);
            //if(rounded) this.round({override: true});
            this.refName = nRefName;
        } else {
            nSegX = new Seg(this.segX.c1 - dOrigin[0], this.segX.c2 - dOrigin[0]); nSegX.multiply(dFactor[0]);
            nSegY = new Seg(this.segY.c1 - dOrigin[1], this.segY.c2 - dOrigin[1]); nSegY.multiply(dFactor[1]);
            return ((new Rect({ segX : nSegX, segY : nSegY }, nRefName)))//.round({ override : true }));
        }
    },

    withSize : function(size) {
        return (new Rect({ center : this.getCenter(), size : size}));
    },
    
    move : function(options) {
        var nRect = this.clone();

        var vector = options.vector; var center = options.center; var scale = options.scale; var staticPoint = ( options.staticPoint ) ? options.staticPoint.clone() : false;
        if (staticPoint && scale) {
            if (staticPoint.isPoint) staticPoint = staticPoint.inRef(this.refName).getValue();
            center = staticPoint.minus(staticPoint.minus(nRect.getCenter()).multiply(scale));
        }
        if (vector) {
            if (vector.isVector) vector = vector.inRef(this.refName).getValue();
            nRect.segX.add(vector[0]);
            nRect.segY.add(vector[1]);
        }
        
        if (center) {
            nRect.segX.setMiddle(center[0]);
            nRect.segY.setMiddle(center[1]);
        }
        
        if (scale) {
          var f = scale; // factor

          var nL = f*(nRect.segX.length());
          var m = nRect.segX.getMiddle();
          nRect.segX =  (new Seg(m-nL/2, m+nL/2));

          nL = f*(nRect.segY.length());
          m = nRect.segY.getMiddle();
          nRect.segY = (new Seg(m-nL/2, m+nL/2));
        }
        //nRect.segX.c1 = nRect.segX.c1.round();
        //nRect.segX.c2 = nRect.segX.c2.round();
        //nRect.segY.c1 = nRect.segY.c1.round();
        //nRect.segY.c2 = nRect.segY.c2.round();
        if(options.override) {
            this.segX = nRect.segX;
            this.segY = nRect.segY;
            
            return (this);
        }
        return (nRect);
    },
    
    position : function(){
      return new Point({ x: this.segX.c1, y: this.segY.c1, refName : this.refName});
    },
    
    points : function(){
      // in direct sens
      return [
        new Point({ x: this.segX.c1, y: this.segY.c1, refName : this.refName}),
        new Point({ x: this.segX.c1, y: this.segY.c2, refName : this.refName}),
        new Point({ x: this.segX.c2, y: this.segY.c2, refName : this.refName}),
        new Point({ x: this.segX.c2, y: this.segY.c1, refName : this.refName})
      ];
    },
    
    clone : function() {
        return (new Rect(R4.prototype.clone.call(this), this.refName));
    }
    
  });

  return Rect;

}));
