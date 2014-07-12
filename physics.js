function World(pointSize) {
  this.lines = [];
  this.points = [];
  this.pointSize = pointSize;
}
World.prototype = {
  update: function() {
    for (var i in lines) {
      lines[i].preserveLength();
    }
    for (var i in points) {
      points[i].update();
    }
  }
}

function Line(world, pointA, pointB, solid) {
  this.world = world;
  this.pointA = pointA;
  this.pointB = pointB;
  this.solid = solid;

  var diffX = this.pointB.x - this.pointA.x;
  var diffY = this.pointB.y - this.pointA.y;
  this.restLength = Math.sqrt(diffX * diffX + diffY * diffY);
  this.pointA.mass += this.restLength * (solid ? 1.0 : .25);
  this.pointB.mass += this.restLength * (solid ? 1.0 : .25);
}
Line.prototype = {
  preserveLength: function() {
    var diffX = this.pointB.x - this.pointA.x;
    var diffY = this.pointB.y - this.pointA.y;
    var length = Math.sqrt(diffX * diffX + diffY * diffY);
    var disp = (this.restLength - length) / length;
    var dx = diffX * disp;
    var dy = diffY * disp;

    var totalMass = this.pointA.mass + this.pointB.mass;
    var mulA = .5 * (this.pointB.mass / totalMass);
    var mulB = .5 - mulA;
    this.pointA.dispX -= mulA * dx;
    this.pointA.dispY -= mulA * dy;
    this.pointB.dispX += mulB * dx;
    this.pointB.dispY += mulB * dy;

    this.pointA.numConstraints++;
    this.pointB.numConstraints++;
  },
  checkCollisions: function() {

  }
}

function Point(world, x, y, fixed) {
  this.world = world;
  this.x = this.xprev = x;
  this.y = this.yprev = y;
  this.u = 0;
  this.v = 0;
  this.mass = 0;
  this.fixed = fixed;

  this.dispX = 0;
  this.dispY = 0;
  this.numConstraints = 0;
}
Point.prototype = {
  checkCollisions: function() {
    for (var i in this.world.points) {
      var point = this.world.points[i];
      var diffX = point.x - this.x;
      if (diffX > -)
    }
  },
  update: function() {

  }
}
