/*
The Game Project 8 - Make it Awesome
*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var game_score;
var flagpole;
var lives;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var clouds;
var mountains;
var trees_x;
var collectables;
var canyons;

var tree;
var cloud;
var mountain;
var collectable;
var canyon;

var platforms;
var enemies;
var collected_Sound;
var jump_Sound;
var flagpole_unreached;

function preload()
{
  flagpole_unreached = loadImage('assets/flagpole_not_reached.png')
  flagpole_reached = loadImage('assets/flagpole_reached.png')
  soundFormats('wav', 'mp3', 'm4a');
  collected_Sound = loadSound('assets/item_sound.wav');
  collected_Sound.setVolume(0.3);
  jump_Sound = loadSound('assets/jump.wav');
  jump_Sound.setVolume(0.2);
  collected_Sound.isLoaded()
}

function setup()
{
  createCanvas(1024, 576);
  floorPos_y = height * 3 / 4;
  lives = 4;
  startGame();
}

function startGame()
{
  gameChar_x = width / 2;
  gameChar_y = floorPos_y;
  game_score = 0;
  flagpole =
  {
    x_Pos: 2700,
    isReached: false
  };
  // Variable to control the background scrolling.

  scrollPos = 0;

  // Variable to store the real position of the gameChar in the game
  // world. Needed for collision detection.

  gameChar_world_x = gameChar_x - scrollPos;

  // Boolean variables to control the movement of the game character.

  isLeft = false;
  isRight = false;
  isFalling = false;
  isPlummeting = false;

  // Initialise arrays of scenery objects.

  trees_x = [100, 400, 700, 900, 1900, 2500];

  clouds = [{
      x_Pos: 50,
      y_Pos: 90
    },
    {
      x_Pos: 330,
      y_Pos: 60
    },
    {
      x_Pos: 500,
      y_Pos: 80
    },
    {
      x_Pos: 700,
      y_Pos: 100
    },
    {
      x_Pos: 900,
      y_Pos: 30
    },
    {
      x_Pos: 1700,
      y_Pos: 30
    }
  ];

  mountains = [{
      x_Pos: 100,
      base: 200,
      height: 232
    },
    {
      x_Pos: 500,
      base: 200,
      height: 232
    },
    {
      x_Pos: 800,
      base: 300,
      height: 332
    },
    {
      x_Pos: 1500,
      base: 200,
      height: 232
    },
    {
      x_Pos: 2000,
      base: 150,
      height: 132
    }
  ];

  canyons = [{
      x_Pos: 0,
      width: 90
    },
    {
      x_Pos: 300,
      width: 100
    },
    {
      x_Pos: 550,
      width: 150
    },
    {
      x_Pos: 850,
      width: 100
    },
    {
      x_Pos: 1000,
      width: 150
    },
    {
      x_Pos: 1200,
      width: 200
    },
    {
      x_Pos: 1500,
      width: 100
    },
    {
      x_Pos: 2100,
      width: 150
    }
  ];

  collectables = [{
      x_Pos: 150,
      isFound: false
    },
    {
      x_Pos: 200,
      isFound: false
    },
    {
      x_Pos: 250,
      isFound: false
    },
    {
      x_Pos: 400,
      isFound: false
    },
    {
      x_Pos: 750,
      isFound: false
    },
    {
      x_Pos: 1400,
      isFound: false
    }
  ];

  // Initialise scenery objects

  tree = {
    x_Pos: 0,
    Pos_y: 332,
    trunk_Width: 30,
    trunk_Height: 100,
    leaves_radius: 100
  };

  cloud = {
    colour: "FFFFFF",
    x_Pos: 40,
    y_Pos: 80,
    width: 60,
    height: 50
  };

  mountain = {
    base: 200,
    height: 282,
    x_Pos: 300,
    y_Pos: 432
  };

  canyon = {
    x_Pos: 300,
    width: 100
  };

  collectable = {
    x_Pos: 100,
    y_Pos: 420,
    size: 1.5,
    isFound: false
  };

  lives -= 1;

  platforms = [];
  platforms.push(new Platform(1000, 100, 100));
  platforms.push(new Platform(1500, 100, 100));

  enemies = [];
  enemies.push(new Enemy(100,floorPos_y,100))
}

function draw()
{
  if (lives > 0)
  {
    // fill the sky blue
    background(100, 155, 255);

    // draw some green ground
    noStroke();
    fill(0, 155, 0);
    rect(0, floorPos_y, width, height / 4);

    fill(0, 0, 0);
    textSize(20);
    text("Score: " + game_score, 10, 30);
    text("Lives: " + lives, 10, 50);

    push(translate(scrollPos, 0));

    // Draw clouds.

    drawClouds();

    // Draw mountains.

    for (var m = 0; m < mountains.length; m++)
		{
      drawMountains(mountains[m]);
    }

    // Draw trees.

    for (var t = 0; t < trees_x.length; t++)
		{
      drawTrees(trees_x[t]);
		}
    // Draw canyons.

    for (var k = 0; k < canyons.length; k++)
		{
      drawCanyon(canyons[k]);
      checkCanyon(canyons[k]);
    }

    // Draw collectable items.

    for (var i = 0; i < collectables.length; i++)
		{
      drawCollectable(collectables[i]);
      checkCollectable(collectables[i]);
    }

    if (!checkFlagpole.isReached)
    {
      checkFlagpole(flagpole);
    }
    renderFlagpole(flagpole);

    //Draw platforms
    for (var p = 0; p < platforms.length; p++)
    {
      platforms[p].draw();
      platforms[p].moving();
    }

    //Draw enemies
    for (var e = 0; e < enemies.length; e++)
    {
      enemies[e].draw();
      enemies[e].update();
    }

    pop();
    // Draw game character.

    drawGameChar();

    // Logic to make the game character move or the background scroll.

    if (isLeft)
		{
      if (gameChar_x > width * 0.2)
			{
        gameChar_x -= 5;
      }

			else
			{
        scrollPos += 5;
      }
    }

    if (isRight)
		{
      if (gameChar_x < width * 0.8)
			{
          gameChar_x += 5;
      }

        else
        {
        scrollPos -= 5; // negative for moving against the background
        }
    }

    // Logic to make the game character rise and fall.

    if (gameChar_y !== floorPos_y)
		{
      var isContact = false;
      for (var i = 0; i < platforms.length; i++)
      {
        if (platforms[i].checkContact(gameChar_world_x, gameChar_y))
        {
          isContact = true;
          break;
        }
      }
      if (!isContact)
      {
        gameChar_y += 2;
        isFalling = true;
      }
      else
      {
          isFalling = false;
      }
    }
		else
		{
      isFalling = false;
    }

    // Update real position of gameChar for collision detection.
    gameChar_world_x = gameChar_x - scrollPos;

    //    renderFlagpole();
  }
}

// -----------------------------------------------------------------------------------------------------
// Key control functions
// -----------------------------------------------------------------------------------------------------

function keyPressed()
{
  // if statements to control the animation of the character when
  // keys are pressed.

  // A or Left arrow keys
  if (keyCode == 65 || keyCode == 37)
	{
    isLeft = true;
  }

  // D or Right arrow keys
  if (keyCode == 68 || keyCode == 39)
	{
    isRight = true;
  }

}

function keyReleased()
{
  // if statements to control the animation of the character when
  // keys are released.

  // A or Left arrow keys
  if (keyCode == 65 || keyCode == 37)
	{
    isLeft = false;
  }

  // D or Right arrow keys
  if (keyCode == 68 || keyCode == 39)
	{
    isRight = false;
  }

  // space bar
  if (keyCode == 32 && !isFalling)
	{
    gameChar_y -= 150;
    isFalling = true;
    jump_Sound.play();

  }
}

// -----------------------------------------------------------------------------------------------------
// Game character render function
// -----------------------------------------------------------------------------------------------------

// Function to draw the game character.

function drawGameChar()
{
  //the game character
  if (isLeft && isFalling)
	{
    // add your jumping-left code

    fill(0, 0, 0);
    // head
    ellipse(gameChar_world_x, gameChar_y - 65, 20, 20);
    // neck
    rect(gameChar_world_x - 5, gameChar_y - 55, 10, 5);
    // body
    rect(gameChar_world_x - 5, gameChar_y - 52, 10, 30);
    // right arm
    rect(gameChar_world_x, gameChar_y - 50, 10, 20, 40);
    // left arm
    rect(gameChar_world_x - 40, gameChar_y - 50, 40, 10, 40);
    // right leg
    rect(gameChar_world_x - 10, gameChar_y - 25, 10, 25, 40);
    // left leg
    rect(gameChar_world_x, gameChar_y - 25, 10, 25, 40);
  }
	else if (isRight && isFalling)
	{
    // add your jumping-right code

    fill(0, 0, 0);
    // head
    ellipse(gameChar_world_x, gameChar_y - 65, 20, 20);
    // neck
    rect(gameChar_world_x - 5, gameChar_y - 55, 10, 5);

    // body
    rect(gameChar_world_x - 5, gameChar_y - 52, 10, 30);

    // left arm
    rect(gameChar_world_x - 10, gameChar_y - 50, 10, 20, 40);

    // right arm
    rect(gameChar_world_x, gameChar_y - 50, 50, 10, 40);

    // right leg
    rect(gameChar_world_x - 10, gameChar_y - 25, 10, 25, 40);
    // left leg
    rect(gameChar_world_x, gameChar_y - 25, 10, 25, 40);
  }
	else if (isLeft)
	{
    // add your walking left code

    fill(0, 0, 0);
    // head
    ellipse(gameChar_world_x, gameChar_y - 65, 20, 20);
    // neck
    rect(gameChar_world_x - 5, gameChar_y - 55, 10, 5);
    // body
    rect(gameChar_world_x - 5, gameChar_y - 52, 10, 30);
    // right arm
    rect(gameChar_world_x, gameChar_y - 50, 10, 20, 40);
    // left arm
    rect(gameChar_world_x - 40, gameChar_y - 50, 40, 10, 40);
    // right leg
    rect(gameChar_world_x - 20, gameChar_y - 25, 10, 10, 40);
    rect(gameChar_world_x - 30, gameChar_y - 25, 30, 10, 40);
    // left leg
    rect(gameChar_world_x, gameChar_y - 25, 10, 25, 40);
  }
	else if (isRight)
	{
    // add your walking right code

    fill(0, 0, 0);
    // head
    ellipse(gameChar_world_x, gameChar_y - 65, 20, 20);
    // neck
    rect(gameChar_world_x - 5, gameChar_y - 55, 10, 5);
    // body
    rect(gameChar_world_x - 5, gameChar_y - 52, 10, 30);
    // left arm
    rect(gameChar_world_x - 10, gameChar_y - 50, 10, 25, 40);
    // right arm
    rect(gameChar_world_x, gameChar_y - 50, 40, 10, 40);
    // right leg
    rect(gameChar_world_x - 10, gameChar_y - 25, 10, 25, 40);
    // left leg
    rect(gameChar_world_x - 10, gameChar_y - 25, 40, 10, 40);

  }
	else if (isFalling || isPlummeting)
	{
    // add your jumping facing forwards code

    fill(0, 0, 0);
    // head
    ellipse(gameChar_world_x, gameChar_y - 65, 20, 20);
    // neck
    rect(gameChar_world_x - 5, gameChar_y - 55, 10, 5);
    // body
    rect(gameChar_world_x - 5, gameChar_y - 52, 10, 30);
    // left arm
    rect(gameChar_world_x - 40, gameChar_y - 50, 40, 10, 40);
    // right arm
    rect(gameChar_world_x, gameChar_y - 50, 40, 10, 40);
    // right leg
    rect(gameChar_world_x - 10, gameChar_y - 25, 10, 25, 40);
    // left leg
    rect(gameChar_world_x, gameChar_y - 25, 10, 25, 40);
  }
	else
	{
    // add your standing front facing code
    fill(0, 0, 0);
    // head
    ellipse(gameChar_world_x, gameChar_y - 65, 20, 20);
    // neck
    rect(gameChar_world_x - 5, gameChar_y - 60, 10, 15);
    // body
    rect(gameChar_world_x - 5, gameChar_y - 52, 10, 30);
    // right arm
    rect(gameChar_world_x - 10, gameChar_y - 50, 10, 25, 40);
    // left arm
    rect(gameChar_world_x, gameChar_y - 50, 10, 25, 40);
    // right leg
    rect(gameChar_world_x - 10, gameChar_y - 25, 10, 25, 40);
    // left leg
    rect(gameChar_world_x, gameChar_y - 25, 10, 25, 40);

  }
}

// -----------------------------------------------------------------------------------------------------
// Background render functions
// -----------------------------------------------------------------------------------------------------

// Function to draw cloud objects.

function drawClouds()
{
  for (var c = 0; c < clouds.length; c++)
	{
    cloud.x_Pos = clouds[c].x_Pos;
    cloud.y_Pos = clouds[c].y_Pos;

    fill(cloud.colour);
    ellipse(cloud.x_Pos, cloud.y_Pos + 10, cloud.width, cloud.height);
    ellipse(cloud.x_Pos + 30, cloud.y_Pos, cloud.width, cloud.height);
    ellipse(cloud.x_Pos + 80, cloud.y_Pos + 10, cloud.width, cloud.height);
    ellipse(cloud.x_Pos + 20, cloud.y_Pos + 30, cloud.width, cloud.height);
    ellipse(cloud.x_Pos + 60, cloud.y_Pos + 25, cloud.width, cloud.height);
  }
}

// Function to draw mountains objects.

function drawMountains(t_mountain)
{
  for (var m = 0; m < mountains.length; m++)
	{
    fill(106, 90, 205);
    strokeWeight(0);
    triangle(t_mountain.x_Pos, mountain.y_Pos, (2 * t_mountain.x_Pos + t_mountain.base) / 2, t_mountain.height, t_mountain.x_Pos + t_mountain.base, floorPos_y);

  }
}

// Function to draw trees objects.

function drawTrees(tree_x)
{
  for (var t = 0; t < trees_x.length; t++)
	{
    tree.Pos_x = trees_x[t];
    fill(139, 69, 19);
    rect(tree.Pos_x, tree.Pos_y, tree.trunk_Width, tree.trunk_Height);
    fill(0, 100, 0);
    ellipse(tree.Pos_x + 15, tree.Pos_y - 17, tree.leaves_radius, tree.leaves_radius);
  }
}

// -----------------------------------------------------------------------------------------------------
// Canyon render and check functions
// -----------------------------------------------------------------------------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{

  fill(0);
  rect(t_canyon.x_Pos, floorPos_y, t_canyon.width, height - floorPos_y);

  // spikes
  for (var t = 0; t < 4; t++)
	{
    fill(139, 69, 19);
    noStroke();
    triangle(t_canyon.x_Pos + t_canyon.width / 4 * t, height,
      t_canyon.x_Pos + t_canyon.width / 8 + t_canyon.width / 4 * t, height - 50,
      t_canyon.x_Pos + t_canyon.width / 4 + t_canyon.width / 4 * t, height);
  }
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
  if (gameChar_world_x >= t_canyon.x_Pos && gameChar_world_x <= (t_canyon.width + t_canyon.x_Pos) && gameChar_y >= floorPos_y)
	{
    isPlummeting = true;
  }

  // when close to the canyon
  if (isPlummeting)
	{
    gameChar_y += 20;
    textSize(45);
    fill(255, 0, 0);
    text("Game Over! - Press space to continue", width / 2, height / 2);
    startGame();
  }
}

// -----------------------------------------------------------------------------------------------------
// Collectable items render and check functions
// -----------------------------------------------------------------------------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
  for (var c = 0; c < canyons.length; c++)
	{
    // collectable can't be collected and be within a canyon
    if (!t_collectable.isFound && !(t_collectable.x_Pos >= canyons[c].x_Pos && t_collectable.x_Pos <= canyons[c].width + canyons[c].x_Pos))
    {
      fill(255, 0, 255);
      quad(t_collectable.x_Pos, collectable.y_Pos,
        t_collectable.x_Pos + (5 * collectable.size), collectable.y_Pos - (10 * collectable.size),
        t_collectable.x_Pos + (10 * collectable.size), collectable.y_Pos,
        t_collectable.x_Pos + (5 * collectable.size), collectable.y_Pos + (10 * collectable.size));
    }

  }
}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
  if (dist(gameChar_world_x, gameChar_y, t_collectable.x_Pos, collectable.y_Pos) <= 20)
  {
    t_collectable.isFound = true;
  }

  if (t_collectable.isFound)
  {
      game_score++;
      collected_Sound.play();
  }
}

function renderFlagpole(flagpole)
{
  if (!flagpole.isReached)
  {
   // image('assets/flagpole_not_reached.png', 2000, floorPos_y - 400);
    fill(139, 69, 19);
    stroke(0);
    strokeWeight(2);
    rect(2700, floorPos_y - 60, 90, 60);
    line(2700, floorPos_y - 40, 2790, floorPos_y - 40);
    fill(255,255,20);
    ellipse(2745, floorPos_y - 40, 19, 19);
    strokeWeight(0);
  }
  else
  {
    fill(139, 69, 19);
    stroke(0);
    strokeWeight(2);
    rect(2700, floorPos_y - 60, 90, 60);
    strokeWeight(0)
  }
}

// function to check flagpole is reached
function checkFlagpole(t_flagpole)
{
  if (dist(gameChar_world_x, gameChar_y, flagpole.x_Pos) <= 20)
  {
    t_flagpole.isReached = true;
  }
}

// function to create platform
function Platform(x_Pos, y_Pos, length)
{
  var p = {
            x_Pos: x_Pos,
            y_Pos: floorPos_y - y_Pos,
            length: length,
            current_X_pos: x_Pos,
            incr:  1,
            range: 200,
            draw: function()
            {
              fill(255, 125, 255);
              stroke(0);
              rect(this.current_X_pos, this.y_Pos, this.length, 20,25);
            },
            checkContact: function(gc_x, gc_y)
            {
              if (gc_x > this.current_X_pos && gc_x < (this.current_X_pos + this.length) && (gc_y > this.y_Pos - 3 && gc_y < this.y_Pos))
              {
                return true;
              }
              return false;
            },
            moving: function()
            {
              if (this.x_Pos > this.current_X_pos)
              {
                this.incr = 1;
              }
              else if (this.x_Pos + this.range < this. current_X_pos)
              {
                this.incr = -1;
              }
              // return updated x pos
               this.current_X_pos += this.incr;
            }
          }
  return p;
}

function Enemy(x_Pos, y_Pos, range)
{
  this.x_Pos = x_Pos;
  this.y_Pos = y_Pos;
  this.range = range;
  this.current_X_pos = x_Pos;
  this.incr = 1;
  this.range = 100,
  this.draw = function()
  {
    strokeWeight(0);
    fill(20,20,0);
    ellipse(this.current_X_pos, this.y_Pos - 25, 50, 50);
    fill(255,0,0);
    ellipse(this.current_X_pos + 5, this.y_Pos - 25, 5, 5)
    ellipse(this.current_X_pos - 5, this.y_Pos - 25, 5, 5)
    stroke(255);
    strokeWeight(3);
    line(this.current_X_pos - 15, this.y - 35,
        this.current_X_pos - 5, this.y - 30);
    line(this.current_X_pos + 15, this.y - 35,
        this.current_X_pos + 5, this.y - 30);
  },
  this.update = function()
  {
    this.current_X_pos += this.incr;
    if (this.current_X_pos < this.x)
    {
      this.incr = 1;
    }
    else if (this.current_X_pos > this.x_Pos + this.range)
    {
        this.incr = -1;
    }
  }

}
