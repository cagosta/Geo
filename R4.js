define('Geo/R4', ['Geo/Seg'], function(Seg) {


  var R4 = function(options) {
    var a = options;
    if (a.segX) { // 2 segs
      this.segX = a.segX;
      this.segY = a.segY;
    } else if (a.isRect) { // a rect
      this.segX = new Seg(a.segX.c1, a.segX.c2);
      this.segY = new Seg(a.segY.c1, a.segY.c2);
    } else if (a.p1) {// 2 points
      this.segX = new Seg(a.p1[0], a.p2[0]);
      this.segY = new Seg(a.p1[1], a.p2[1]);
    } else {
      if (a.center) { // center and size
        var c = a.center; var s = a.size;
        var halfW = s[0]/2;
        var halfH = s[1]/2;
        this.segX = new Seg(c[0] - halfW, c[0] + halfW);
        this.segY = new Seg(c[1] - halfH, c[1] + halfH);
      } else { // [[][]]  
        this.segX = new Seg(a[0][0], a[0][0]+a[1][0]);
        this.segY = new Seg(a[0][1], a[0][1]+a[1][1]);
      }
    }
    this.value = this.getValue();
  };
    
  R4.prototype = {
    
    isR4: true,
    
    isIn : function(r) { // should and can be optimised
      // return (r.contains.bind(r).for(this.getPoints())); !!bug in android browser ( for)
    },
    
    getPoints : function() {
      var v = this.getValue();
      return ([v[0], v[0].add(v[1])]);
    },
    
    setCenter : function(p) {
      this.segX.setMiddle(p[0]);
      this.segY.setMiddle(p[1]);

      return this;
    },
        
    contains : function(p) {
      return (this.segX.contains(p[0]) && this.segY.contains(p[1]));
    },
        
    add : function(p) {
      if(p.isPoint) {
        p[0] = p.x;
        p[1] = p.y;
      }
      return (this.move({vector : [-p[0],-p[1]]}));
    },
        
    equals : function(r) {
      if(r.isR4) {
        return (SegX.equals(this.segX) && SegY.equals(this.segY));
      }
      return (r[0][0] === this.segX.c1 && r[0][1] === this.segY.c1 && r[1][0] === this.segX.getLength() && r[1][1] === this.segY.getLength());
    },
            
    getCenter : function() {
      return ([this.segX.getMiddle(), this.segY.getMiddle()])
    },
            
    getIntersectionWith : function(r)  {
      return (( this.segX.c2 <= r.segX.c1 || this.segX.c1 >= r.segX.c2 || this.segY.c2 <= r.segY.c1 || this.segY.c1 >= r.segY.c2 ) ? [0,0] : new R4({ segX : new Seg( (this.segX.c1 > r.segX.c1) ? this.segX.c1 : r.segX.c1, (this.segX.c2 < r.segX.c2) ? this.segX.c2 : r.segX.c2 ), segY : new Seg( (this.segY.c1 > r.segY.c1) ? this.segY.c1 : r.segY.c1, (this.segY.c2 < r.segY.c2) ? this.segY.c2 : r.segY.c2) })); 
    },
        
    scale : function(f) {// scale function should not be called by move({scale:}), MNS{
        this.segX.scale(f);
        this.segY.scale(f);
    },
        
    withSize : function(size) {
        return (new R4({ centeredRect : [this.getCenter(), size]}));
    },
      
    getValue : function() {
        return ([[this.segX.c1, this.segY.c1],[this.segX.getLength(), this.segY.getLength()]]);
    },

    clone : function() {
        return (new R4({ segX : new Seg(this.segX.c1, this.segX.c2), segY : new Seg(this.segY.c1, this.segY.c2) }));
    },
    
    setPosition : function(p) {
      var l;
      if (p.isPoint) {
        this.segX.length();
        this.segX.c1 = p.x;
        this.segX.c2 = p.x + l;
        l = this.segY.length();
        this.segY.c1 = p.y;
        this.segY.c2 = p.y + l;
      } else {
        l = this.segX.length();
        this.segX.c1 = p[0];
        this.segX.c2 = p[0] + l;
         
        l = this.segY.length();
        this.segY.c1 = p[1];
        this.segY.c2 = p[1] + l;
      }
    },
    
    setSize : function(s) {
       this.segX.c2 = this.segX.c1 + s[0];
       this.segY.c2 = this.segY.c1 + s[1];
       
       return (this);
    },
    
    setRect : function(r) {
       this.segX.c1 = SegX.c1;
       this.segX.c2 = SegX.c2;
       this.segY.c1 = SegY.c1;
       this.segY.c2 = SegY.c2;
       
       return (this);
    },
    
    round: function(options) {
        var sX = this.segX.round(), sY = this.segY.round();
        if (options && options.override)
        {
            this.segX = sX;
            this.segY = sY;
            return (this);
        }
        return (new (this.constructor)(this.getValue()));
    },
    
    squared : function() {
        var minL = Math.min(this.segX.length(), this.segY.length());
        return (new t.R4({ centeredRect : [this.getCenter(), [minL, minL]]}));
    }
    
  };
    
  return R4;
    
});
