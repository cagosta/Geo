(define('Geo/Circle', function() {
  
  var Circle = function(options){
    this.setOptions(options);
  };
  
  Circle.prototype = {

    setOptions: function(options){
      this.center = options.center;
      this.id = options.id;
      this.r = options.r;
    },

    pointOnCircle: function(angle){
      return {
        point : this.getPosFromAngle(angle),
        circle : this,
        angle : angle
      }
    },

    getPosFromAngle: function(angle){
      return [this.center[0]+this.r*Math.cos(angle),this.center[1]+this.r*Math.sin(angle)]
    },

    getArcToCircle: function(c){
      //we get the arc from self to c, clockwise
      
      //ne circle is inside the other
      //console.log('==>', this.center.minus(c.center).norm(), [this.r,c.r].max() , [this.r,c.r].min());
      if (this.center.minus(c.center).norm() <= ([this.r,c.r].max()) - [this.r,c.r].min()){
        var circle = (this.r > c.r) ? this : c ;
        return [false,{ circle : circle}]
      } 
      
      var diff = c.center.minus(this.center);
      
      //same radius
      if (this.r == c.r){
        var angle = diff.orth().getAngleFromAxis();
        return [this.pointOnCircle(angle),c.pointOnCircle(angle)];
      }

      //Pi is the center of i
      //ri the radius
      //Ti the points on the arc
      //in the triangle where arc is hypothenus (P P1 T1), P P1 P2 on a straight line and P T1 T2 one straight line, we use Thales
      // (vectors equality) : P1P = P2P1*r2/(r2-r1)
      
      var pPoint = diff.multiply(c.r/(this.r-c.r)).add(c.center)
      
      var beta =  Math.asin(this.r/this.center.minus(pPoint).norm())
      
      // when r > c.r, the P1P2 vector is not on the same side of the angle, we need to add a case 
      var alpha = (this.r > c.r ? Math.PI/2 - beta : Math.PI/2 + beta)
      var angle = diff.getAngleFromAxis() + alpha
      return [this.pointOnCircle(angle),c.pointOnCircle(angle)]
    },

    minX: function(){
      return this.center[0]-this.r;
    }
  };
  
  return Circle;
  
}));
