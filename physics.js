function World(pointSize) {
  this.lines = [];
  this.points = [];
  this.pointSize = pointSize;
}
World.prototype = {
  update: function() {
    for (var i in lines) {
      lines[i].updateVectors();
      lines[i].preserveLength();
      lines[i].checkCollisions();
    }
    for (var i in points) {
      points[i].checkCollisions();
    }
    for (var i in points) {
      points[i].update();
    }
  }
}

function Line(world, pointA, pointB, solid) {
  this.world = world;
  this.world.lines.push(this);
  this.pointA = pointA;
  this.pointB = pointB;
  this.solid = solid;

  this.updateVectors();
  this.restLength = this.length;
  this.pointA.mass += this.restLength * (solid ? 1.0 : .25);
  this.pointB.mass += this.restLength * (solid ? 1.0 : .25);
}
Line.prototype = {
  updateVectors: function() {
    var diffX = this.pointB.x - this.pointA.x;
    var diffY = this.pointB.y - this.pointA.y;
    this.length = Math.sqrt(diffX * diffX + diffY * diffY);
    this.dx = diffX / this.length;
    this.dy = diffY / this.length;
    this.massDiff = this.pointB.mass - this.pointA.mass;
    this.totalMass = this.pointA.mass + this.pointB.mass;
    this.mulA = .5 * (this.pointB.mass / totalMass);
    this.mulB = .5 - mulA;
  },
  preserveLength: function() {
    var disp = this.restLength - this.length;
    var dispX = this.dx * disp;
    var dispY = this.dy * disp;

    this.pointA.dispX -= this.mulA * dispX;
    this.pointA.dispY -= this.mulA * dispY;
    this.pointB.dispX += this.mulB * dispX;
    this.pointB.dispY += this.mulB * dispY;

    this.pointA.numConstraints++;
    this.pointB.numConstraints++;
  },
  checkCollisions: function() {
    for (var i in this.world.points) {
      var point = this.world.points[i];
      if (point != this.pointA && point != this.pointB) {
        var diffX = point.x - this.pointA.x;
        var diffY = point.y - this.pointA.y;
        var dp = diffX * this.dx + diffY * this.dy;
        if (dp > 0 && dp < this.length) {
          var cp = diffX * this.dy - diffY * this.dx;
          if (cp > -this.world.pointSize && cp < this.world.pointSize) {
            var f = dp / this.length;
            var interpolatedMass = this.pointA.mass + f * this.massDiff;
            var totalMass = interpolatedMass + point.mass;
            var mulPoint = .5 * (interpolatedMass / totalMass);
            var mulAB = .5 - mulPoint;

            var disp = cp > 0 ? this.world.pointSize - cp : -this.world.pointSize - cp;
            var dispX = disp * this.dy;
            var dispY = disp * -this.dx;
            point.dispX += mulPoint * dispX;
            point.dispY += mulPoint * dispY;

            var mulSq = this.mulAB / (this.mulA * this.mulA + this.mulB * this.mulB);
            var mulA2 = this.mulA * mulSq;
            var mulB2 = this.mulB * mulSq;
            this.pointA.dispX -= mulA2 * dispX;
            this.pointA.dispY -= mulA2 * dispY;
            this.pointB.dispX += mulB2 * dispX;
            this.pointB.dispY += mulB2 * dispY;

            this.pointA.numConstraints++;
            this.pointB.numConstraints++;
            point.numConstraints++;
          }
        }
      }
    }
  }
}

function Point(world, x, y, fixed) {
  this.world = world;
  this.id = this.world.points.length;
  this.world.points.push(this);
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
    for (var i = this.id + 1; i < this.world.points.length; i++) {
      var point = this.world.points[i];
      var diffX = point.x - this.x;
      if (diffX > -this.world.pointSize && diffX < this.world.pointSize) {
        var diffY = point.y - this.y;
        if (diffY > -this.world.pointSize && diffY < this.world.pointSize) {
          var length = Math.sqrt(diffX * diffX + diffY * diffY);
          if (dist < this.world.pointSize) {
            var disp = (this.restLength - length) / length;
            var dx = diffX * disp;
            var dy = diffY * disp;

            var totalMass = this.mass + point.mass;
            var mulA = .5 * (point.mass / totalMass);
            var mulB = .5 - mulA;
            this.dispX -= mulA * dx;
            this.dispY -= mulA * dy;
            point.dispX += mulB * dx;
            point.dispY += mulB * dy;

            this.numConstraints++;
            point.numConstraints++;
          }
        }
      }
    }
  },
  update: function() {
    if (!this.fixed) {
      this.x += this.dispX / this.numConstraints;
      this.y += this.dispY / this.numConstraints;
      this.u = this.x - this.xprev + this.world.gravX;
      this.v = this.y - this.yprev + this.world.gravY;
      this.xprev = this.x;
      this.yprev = this.y;
      this.x += this.u;
      this.y += this.v;
    }

    this.numConstraints = 0;
  }
}
