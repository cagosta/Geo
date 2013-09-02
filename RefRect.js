(define('Geo/RefRect', [
  'objects/extend',
  'Geo/Rect',
  'Geo/Ref',
  'Geo/Point'
], function(extend, Rect, Ref, Point) {
    
  var RefRect = function(options) {
    Rect.call(this, options.rect);

    if (!options.ref.origin) options.ref.origin = this.getValue()[0];

    this.ref = options.ref;
  }

  extend(RefRect.prototype, Rect.prototype, {
    
    reset : function(options) {
      Rect.call(this, options);
      this.ref.origin = this.getValue()[0]; // we refresh the ref origin
    },

    isRefRect : true,

    move : function(options) {
      if(options.override) {
        Rect.prototype.move.call(this, options);

        if(options.scale)
        {
           this.ref.factor = this.ref.factor/options.scale;
        }

        this.ref.origin = this.getValue()[0]; // we refresh the ref origin

        return (this);
      }
      return (Rect.prototype.move.call(this, options));
    },
        
    setPosition : function(p) {
      Rect.prototype.setPosition.call(this, p);
      this.ref.origin = p;
    },
             
    getCenterInOwnRef : function() {
       return (new Point({position:getFromRefToRef(this.getValue()[1].divide(2), this.refName, this.ref.name),refName:this.ref.name}));
    },
             
    clone : function() {
       return (new Rect(this.getValue(), this.refName));
    }
         
  });
        
  return RefRect;
        
}));