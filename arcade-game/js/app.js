/* app.js creates enemy, gem, and player object prototype classes used
 * for engine game play. player is created here. 
*/

/* allEnemies and allGems empty array created. Row choices for enemies stored in array.
 * Row and Column choices stored for gems.
*/
allEnemies = [];
enemyRowChoices = [260,175,90];
allGems = [];
gemRowChoices = [345,260,175];
gemColChoices = [17,117,217,317,417];

var Enemy = function() {
    // Variables applied to each of our instances go here,
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    // slowest bug stored as base object. Base speed set to 50.
    // y location based on random choice from enemyRowChoices array
    // enemy is added to allEnemies array upon creation
    this.sprite = 'images/enemy-bug.png';
	this.x = 0;
	this.y = enemyRowChoices[Math.floor(Math.random()*enemyRowChoices.length)];
	allEnemies.push(this);
	this.width = 101;
	this.height = 171;
	this.speed = 50;
};

//fastest enemy
var SuperFastEnemy = function() {
	var enemy = new Enemy();
	enemy.speed = 1000;
};

//second fastest enemy
var FastEnemy = function() {
	var enemy = new Enemy();
	enemy.speed = 500;
};

//second slowest enemy
var MediumEnemy = function() {
	var enemy = new Enemy();
	enemy.speed = 250;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
// updates position of enemy. Removes enemy from allEnemies array if they leave the screen.
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
	this.x += dt*this.speed;
	if (this.x > 550){
		number = allEnemies.indexOf(this);
		allEnemies.splice(number,1);
	};
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Player object creation, initial character is char-boy.
// Player starts with 3 lives and a score of 0.
var Player = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char-boy.png';
	this.x = 200;
	this.y = 480;
	this.width = 101;
	this.height = 171;
	this.lives = 3;
	this.score = 0;
};


// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

/* updates player's x and y position based on key press on key board (up,down,left,right arrows)
 * x position is updated by 100 pixels, while y is updated by 85 unless it's the initial move for player
 * then it's 50 pixels. Character can't move off screen as the events won't trigger.
 * If player, reaches water, then the score is updated by 100 and player starts at beginning.
 */
Player.prototype.handleInput = function(e) {
	if (e == 'right' && this.x < 400){
		this.x += 100;
	} else if(e =='left' && this.x >99){
		this.x -= 100;
	} else if(e === 'up' && this.y == 480){
		this.y -= 50;
	} else if(e === 'up' && this.y > 90){
		this.y -= 85;
	}else if(e === 'up' && this.y === 90){
		this.score += 100;
		this.y = 480;
		this.x = 200;
	} else if (e === 'down' && this.y < 480){
		if (this.y === 430){
			this.y += 50;
		} else{
			this.y += 85;
		};
	};
};

//creation of player for the game.
player = new Player()
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);	
});

/* creation of Gem class. initial class represents blue gem.
 * maxTime refers to time the gem will remain on screen before disappearing.
 * images were cropped to 75 pixels square to fit on game board better.
 * x and y positions are randomly assigned based on arrays from beginning.
 * blue gems are worth 100 points and will stay on the screen for 20 seconds.
 * probabilty is 70% based on engine.js.
*/
var Gem = function() {
    // The image/sprite for the gems, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/Gem Blue.png';
	this.x = gemColChoices[Math.floor(Math.random()*gemColChoices.length)];
	this.y = gemRowChoices[Math.floor(Math.random()*gemRowChoices.length)];
	allGems.push(this);
	this.width = 75;
	this.height = 75;
	this.score = 100;
	this.time = 0;
	this.maxTime = 1200;
};


// Draw the gem on the screen, required method for game
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

//green gems are worth 500 points and will remain on the screen for 10 seconds.
//probability is 20% this will appear from engine.js.
var GreenGem = function() {
	var gem = new Gem();
    gem.sprite = 'images/Gem Green.png';
	gem.score = 500;
	gem.maxTime = 600;
};

// orange gems are worth 100 points and will remain on the screen for 5 seconds.
// probability is 10% this will appear from engine.js.
var OrangeGem = function() {
	var gem = new Gem();
    gem.sprite = 'images/Gem Orange.png';
	gem.score = 1000;
	gem.maxTime = 300;
};

// updates each gem's time counter until it hits it's max. At that point the gem
// is removed from the allGemArray.
Gem.prototype.update = function() {
	allGems.forEach(function(gem){
		gem.time += 1;
		if (gem.time == gem.maxTime){
				number = allGems.indexOf(gem);
		        allGems.splice(number,1);
			};
	});
};