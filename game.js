window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

$(function() {
  var canvas = document.getElementsByTagName('canvas')[0];
  canvas.width = 800;
  canvas.height = 500;
  var ctx = canvas.getContext('2d');
  var world = new World(canvas.width, canvas.height, 10, 0, .01);

  for (var i = 0; i < 20; i++) {
    var p = new Point(world, (i % 2) * 100 + i * 5, i / 2 * 50, false);
  }
  for (var i = 0; i < world.points.length - 1; i++) {
    new Line(world, world.points[i], world.points[i + 1], true);
  }
  for (var i = 0; i < world.points.length - 2; i++) {
    new Line(world, world.points[i], world.points[i + 2], true);
  }

  for (var i = 0; i < 20; i++) {
    var p = new Point(world, (i % 2) * 100 + i * 5 + 150, i / 2 * 50, false);
  }
  for (var i = 20; i < world.points.length - 1; i++) {
    new Line(world, world.points[i], world.points[i + 1], true);
  }
  for (var i = 20; i < world.points.length - 2; i++) {
    new Line(world, world.points[i], world.points[i + 2], true);
  }

  for (var i = 0; i < 100; i++) {
    var p = new Point(world, (i % 2) * 25 + 300, i / 2 * 5, false);
  }
  for (var i = 40; i < world.points.length - 1; i++) {
    new Line(world, world.points[i], world.points[i + 1], true);
  }
  
  (function update() {
    requestAnimFrame(update);
    for (var i = 0; i < 1; i++) {
      world.update();
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    world.draw(ctx);
  })();
})
