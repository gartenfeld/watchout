$(document).ready(function(){

  var maxX = 800, maxY = 600;
  var enemies = [];
  var x;
  var y;
  var r = 20;
  var newEnemy;


  var init = function() {
    for (var i = 0; i < 10; i++) {
      newEnemy = new Enemy(0, 0, r);
      enemies.push(newEnemy);
    }
  };

  var drawUser = function () {
    var user = d3.select('.arena')
    .append('image')
    .attr('id', 'user')
    .attr('xlink:href', 'img/man.gif')
    .attr('width', '50')
    .attr('height', '50')
    .attr('x', '400')
    .attr('y', '300');
  };

  var relocate = function(array){
    for (var i = 0; i < array.length; i++) {
      array[i].x = Math.random() * (maxX - 2 * r) + r;
      array[i].y = Math.random() * (maxY - 2 * r) + r;
    }
  };

  var draw = function(data) {
    var dots = d3.select('.arena').selectAll('circle').data(data);
    dots.enter()
    .append('circle')
    .attr('cx', function(d) { return d.x; })
    .attr('cy', function(d) { return d.y; })
    .attr('r', function(d) { return d.r; })
    .attr('class', 'enemy')
    .attr('fill', "url(#image)");
  }

  var update = function(data) {
    var dots = d3.select('.arena').selectAll('.enemy').data(data);
    dots.transition()
    .duration(1500)
    .attr('cx', function(d) { return d.x; })
    .attr('cy', function(d) { return d.y; });
  };



  var drag = d3.behavior.drag()
    .on('drag', function() { 
       c.attr('x', d3.event.x - 25)
        .attr('y', d3.event.y - 30); 
    });

  var Enemy = function (x,y,r) {
    this.x = x;
    this.y = y;
    this.r = r;
  };

  init();
  drawUser();
  relocate(enemies);
  draw(enemies);

  var c = d3.select('#user').call(drag);
  


  setInterval(function(){
    relocate(enemies);
    update(enemies);
  }, 1500);
  // .update(enemies);

});