(define('Geo/Ref', ['Geo/refs'], function(refs) {
       
  var Ref = function(options) { // {}
    this.name = options.name;
    this.origin = options.origin; // in db
    this.factor = options.factor; // factor DB -> this
    refs[this.name] = this;
  };

  Ref.prototype = {
    isRef : true,

    scale : function(o, df) {
      this.origin = o;

      if(typeof(this.factor) === 'number') {
        this.factor *= df;
      }
      else {
        this.factor[0] *= df;
        this.factor[1] *= df;
      }
    }
  };
  
  return Ref;
     
}));
