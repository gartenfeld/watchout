$(document).ready(function(){

  var maxX = 800, maxY = 600;
  var x, y, r = 20;
  var n = 12;
  var collisionCount = 0;
  var currentScore = 0;
  var highScore = 0;
  var enemies;

  var initUser = function () {
    d3.select('.arena')
    .append('image')
    .attr('xlink:href', 'img/girl.gif')
    .attr('id', 'user')
    .attr('width', 70)
    .attr('height', 70)
    .attr('x', maxX/2 - 35)
    .attr('y', maxY/2 - 35);
  };

  var reX = function() {
    return Math.random() * (maxX - 2 * r);
  };

  var reY = function() {
    return Math.random() * (maxY - 2 * r);
  };

  var initEnemies = function() {
    enemies = d3.select('.arena')
    .selectAll('.enemy')
    .data(d3.range(n))
    .enter().append('image')
    .attr('x', reX)
    .attr('y', reY)
    .attr('class', 'enemy')
    .attr('xlink:href', 'img/shuriken.gif')
    .attr('width', 2*r)
    .attr('height', 2*r);
  };

  var move = function(element) {
    element
    .transition()
    .duration(1500)
    .attr('x', reX)
    .attr('y', reY)
    .each('end', function(){
      move(d3.select(this));
    });
  }; 

  var drawBlood = function (x, y) {
    var blood = d3.select('.arena')
    .insert('image', '#user')
    .attr('class', 'blood')
    .attr('xlink:href', 'img/blood.png')
    .attr('width', 35 + Math.random() * 30)
    .attr('height', 35 + Math.random() * 30)
    .attr('x', x + 30 * (Math.random() - 0.5) - 30)
    .attr('y', y + 30 * (Math.random() - 0.5) - 30)
    .attr('opacity', 0)
    .transition()
    .duration(300)
    .attr('opacity', 1);
  };

  var previousCollision = false;

  var checkCollision = function(){
    var user = d3.select('#user');
    var enemies = d3.selectAll('.enemy')[0];
    var enemy;
    var userX = parseFloat(user.attr('x')) + 35;
    var userY = parseFloat(user.attr('y')) + 35;
    var enemyX, enemyY;
    var distX, distY;

    var collision = false;

    for (var i = 0; i < enemies.length; i++) {
      enemy = d3.select(enemies[i]);
      enemyX = parseFloat(enemy.attr('x')) + 20;
      enemyY = parseFloat(enemy.attr('y')) + 20;
      distX = Math.pow((enemyX - userX), 2);
      distY = Math.pow((enemyY - userY), 2);
      if(distX < 35*35 && distY < 40*40) { 
        collision = true;
      }
    }

    if(collision !== previousCollision) {
      onCollision();
      drawBlood(userX, userY);
    }

    previousCollision = collision;

  };

  var checkHighScore = function (curr) {
    if (curr > highScore) {
      highScore = currentScore;
      d3.select('.high').text('High Score: ' + highScore.toString());
    }
  };

  var flashScreen = function(){
    d3.select('.backdrop')
    .transition()
    .duration(50)
    .style('background-color', 'rgba(200, 100, 100, 0.6)')
    .style('background-image', 'url("img/skull.png")')
    .transition()
    .duration(50)
    .style('background-image', 'none')
    .style('background-color', 'rgba(100, 100, 100, 0.9)');
  };

  var onCollision = function(){
    collisionCount++;
    d3.select('.collisions').text('Spilled Blood: ' + collisionCount.toString());
    checkHighScore(currentScore);
    currentScore = 0;
    flashScreen();
  };

  var drag = d3.behavior.drag()
    .on('drag', function() {
       c.attr('x', d3.event.x < maxX - 35 ? ( d3.event.x > 35 ? d3.event.x - 35 : 0) : maxX - 70)
        .attr('y', d3.event.y < maxY - 35 ? ( d3.event.y > 35 ? d3.event.y - 35 : 0) : maxY - 70); 
    });

  initUser();
  initEnemies();

  move(enemies);

  var c = d3.select('#user').call(drag);

  d3.timer(checkCollision);

  setInterval(function(){
    currentScore++;
    d3.select('.current').text('Current Score: ' + currentScore.toString());
  }, 100);  

});