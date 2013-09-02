(define('Geo/Seg', function(r) {
    
  var m = Math;
    
  var Seg = function(c1, c2) {
    this.c1 = c1;
    this.c2 = c2;
  };
    
  Seg.prototype = {
    
    isSeg : true,

    getIntersectionWith : function(seg) {//WARNING : at the moment inter doesn't return a Point
      return ( (this.c2 <= seg.c1 || this.c1 >= seg.c2) ? null : new Seg( ( this.c1 > seg.c1 ) ? this.c1 : seg.c1 , ( this.c2 < seg.c2 ) ? this.c2 : seg.c2 ) );
    },

    contains : function(p) {
      return ((this.c1 < p) && (p < this.c2));
    },
    
    equals : function(seg) {
      return (seg.c1 === this.c1 && seg.c2 === this.c2);
    },
                
    add : function(c) {
      this.c1 += c;
      this.c2 += c;
    },
                
    getMiddle : function() {
        return ((this.c2 + this.c1)*0.5);
    },

    length : function() {
        return (this.getLength());
    },
    
    getLength : function() {
        return (this.c2 - this.c1);
    },
               
    scale : function(f) {
        var nL = f*(this.length());
        this.c1 = f*this.c1;
        this.c2 = this.c1 + nL;
    },
              
    multiply : function(f) {
        this.c1 = f*this.c1;
        this.c2 = f*this.c2;
    },
        
    round : function() {
      this.c1 = this.c1.round();
      this.c2 = this.c2.round();
    },

    setMiddle : function(value) {
         var halfL = this.length()/2;
         this.c1 = value-halfL;
         this.c2 = value+halfL;
    }
        
  };
    
  return Seg;
    
}));