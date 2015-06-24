/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on player,enemy, and gem objects.
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */
var Engine = (function(global) {
     /* create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;
		t = Date.now()-lastTime;
		//sets time counter equal to 0.
		timeCount = 0;
	//sets the canvas width and height
    canvas.width = 505;
    canvas.height = 800;
    //header and footer offset used to draw the game board as title and characters were added.
	headerOffset = 50;
	footerOffset = 150;
	//appends canvas to body of html.
    doc.body.appendChild(canvas);
    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
		var now = Date.now(),
            dt = (now - lastTime) / 1000.0,
			c = dt,
			// sets level for additional difficulty every 500 points.
			level = Math.floor(player.score / 500);
			//updates time counter each time main is called.
			timeCount += 1;
        // initialy makes sure level is set to 1 and not 0 so as not to divide by 0.
		 if (level < 1){
			 level = 1;
		 };
		 /* main game engine logic for determining enemies and gems
		  * initially every 35 seconds a Super Fast enemy is displayed and this time
		  * is decreased every level increase. Fast enemy's are released every 15 seconds
		  * and decreased every level increase. Medium enemy's a little over every 3 seconds
		  * and regular slow enemies a little over 7 seconds. These are constants over the course
		  * of the game.
		 */
		 if (timeCount % Math.floor(2100/level) == 0){
		 	enemyBugs = new SuperFastEnemy();
		 };
		 if (timeCount % Math.floor(440) == 0){
		 	enemyBugs = new Enemy();
		 };
		 if (timeCount % Math.floor(200) == 0){
		 	enemyBugs = new MediumEnemy();
		 };
		 if (timeCount % Math.floor(900/level)== 0){
			 fastBugs = new FastEnemy();
		 };
		 /* Gems are generated every 20 seconds and disapper based on their max time.
		  * A random number is generated and if the number is below .7, a blue gem is generated.
		  * If the number is below .9 (20% chance) then a green gem, and with a 10% chance
		  * a orange gem is generated.
		 */
		if (timeCount % 1200 == 0){
			randomGemNumber = Math.random();
			if (randomGemNumber < .7){
				bluegem = new Gem();
			}
			 else if(randomGemNumber < .9){
				greengem = new GreenGem();
			}
			else {
				orangegem = new OrangeGem();
			};
		};
		/* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */ 
        update(dt);
        render();
        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    };

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    };

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which are needed to update the entities (enemy, gems).
     * collisions are detected between the player and enemies and the player
     * and gems. The gameStatus is then checked to make sure the player has
     * lives available.
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
		checkGameStatus();
    };

    /* This is called by the update function  and loops through all of the
     * objects within the allEnemies array as defined in app.js and calls
     * the update() methods. It will then call the update function for all
     * the gems located in the allGems aray.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
		allGems.forEach(function(gem) {
            gem.update();
        });	
    };
    /* This function initially draws the "game level", it will then call
     * the renderEntities function. This function is called every
     * game tick (or loop of the game engine)
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col,
            //character Images added for each character.
			characterImages = ['images/char-boy.png',
							   'images/char-cat-girl.png',
							   'images/char-horn-girl.png',
							   'images/char-pink-girl.png',
							   'images/char-princess-girl.png'
								],
			//gem images added for each gem used in game play.				
			gemImages = ['images/Gem Blue.png',
						 'images/Gem Green.png',
						 'images/Gem Orange.png'
						 ];
			

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 * headeroffset used because canvas was expanded to include title, score, and lives.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83 + headerOffset);
            };
        };
        /* The drawImage function will again draw each character image at the bottom
         * after the board is drawn. The footer offset is used for positioning of characters.
        */
		for (imageCharacter in characterImages){
			ctx.drawImage(Resources.get(characterImages[imageCharacter]), 100 * imageCharacter, canvas.height - footerOffset);
		};

		/* Lives, Score, and Player Character Label is drawn at the static
		 * locations used in fillText. The area is cleared first with clearRect.
		*/
		var livesLabel = canvas.getContext("2d");
		livesLabel.clearRect(0,0,50,25);
        livesLabel.fillStyle = "blue";
		livesLabel.font = "16px Arial";
		livesLabel.fillText("LIVES", 0, 25);
		
		var scoreLabel = canvas.getContext("2d");
		scoreLabel.clearRect(450,0,50,25)
        scoreLabel.fillStyle = "blue";
		scoreLabel.font = "16px Arial";
		scoreLabel.fillText("SCORE", 450, 25);
		
		var playerCharacter = canvas.getContext("2d");
		scoreLabel.clearRect(100,650,350,50)
        playerCharacter.fillStyle = "blue";
		scoreLabel.font = "42px Futura, Helvetica, sans-serif";
		scoreLabel.fillText("Select Character", 100, 685);

		/* neon light jitter effect used for center title for Frogger game.
		*/
		var text = "Frogger";
		var font = "64px Futura, Helvetica, sans-serif";
		var jitter = 25; // the distance of the maximum jitter
		var offsetX = 130;// offsetX used to draw the black fill box used for title
		var offsetY = 0;
		ctx.font = font;
		ctx.rect(offsetX, offsetY, offsetX + 100, 100);
		ctx.fillStyle = "#fff";
		ctx.fillStyle = "#000";
		ctx.fillRect(offsetX - jitter/2, offsetY, 250, 80);
		ctx.fillStyle = "rgba(255,255,255,0.95)";
		ctx.fillText(text, offsetX, offsetY + 60);
		// created jittered stroke
		ctx.lineWidth = 0.80;
		ctx.strokeStyle = "rgba(255,255,255,0.25)";
		var i = 10; while(i--) { 
			var left = jitter / 2 - Math.random() * jitter;
			var top = jitter / 2 - Math.random() * jitter;
			ctx.strokeText(text, left + offsetX, top + offsetY + 60);
		};
		ctx.strokeStyle = "rgba(0,0,0,0.20)";
		ctx.strokeText(text, offsetX, offsetY + 60);
		
		/* reset area created so user can select text labeled "Reset"
		 * which will reset the game to initial conditions. Button area
		 * uses linear Gradient for color scheme.
		*/
		var resetButton = canvas.getContext('2d');
		var myResetGradient = resetButton.createLinearGradient(0, 60, 70, 90);
		myResetGradient.addColorStop(0, 'purple');
		myResetGradient.addColorStop(0.5, 'blue');
		myResetGradient.addColorStop(1, 'purple');
		resetButton.fillStyle = myResetGradient;
		resetButton.fillRect(0, 60, 70, 30);
		resetButton.fillStyle = 'white';
        resetButton.font = 'bold 18px sans-serif';
        resetButton.fillText('Reset', 10, 80);
		
        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions defined
     * on enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
		/* Loop through all of the objects within the allGems array and call
         * the render function you have defined.
         */
		allGems.forEach(function(gem){
			gem.render();
		})

        player.render();
		
		//clear player.lives variable previously drawn on screen and update with current lives.
		var livesValue = canvas.getContext("2d");
		livesValue.clearRect(75,0,25,25);
        livesValue.fillStyle = "blue";
		livesValue.font = "16px Arial";
		lives = player.lives;
		livesValue.fillText(lives, 75, 25);
		
		//clear player.score variable previously drawn on screen and update with current score.
		var scoreValue = canvas.getContext("2d");
		scoreValue.clearRect(375,0,75,25);
        scoreValue.fillStyle = "blue";
		scoreValue.font = "16px Arial";
		score = player.score;
		scoreValue.fillText(score, 400, 25);
		
		//when lives = 0 then display "Game Over" on canvas.
		if (player.lives === 0){
			var gameOver = canvas.getContext("2d");
			gameOver.fillStyle = "black";
			gameOver.font = "64px Arial";
			gameOver.fillText("GAME OVER", 60, 350);
		};
    };
	
	/*checks to see if a player's max and min x position of image will intersect
	 * max x position of enemy. If either of player's x position is less than
	 * 77 pixels and lies on the same y coordinate, a collision occurs with an enemy.
	*/
	function checkCollisions(){
		allEnemies.forEach(function(enemy){
			if (Math.abs(enemy.x - player.x) < 77 && enemy.y == player.y){
				player.x = 200;
				player.y = 480;
				player.lives -= 1;
			};
		});
	/*checks to see if a player's max and min x position of image will intersect
	 * the gem x center position. If the player's x position is less than
	 * 51 pixels and lies on the same y coordinate, a collision occurs with a gem.
	 * the additional 85 pixels are used because I cropped the gem pictures to fit
	 * better on the game board.
	*/
		allGems.forEach(function(gem){
			if (Math.abs(gem.x - player.x) < 51 && gem.y == (player.y + 85)){
				player.score += gem.score;
				number = allGems.indexOf(gem);
		        allGems.splice(number,1);
			};
		});
		
	};
	
	/*checks to make sure a player has more than 0 lives.
	 * if player has 0 lives, the character is moved back to the beginning and
	 * all enemies and gems are removed. The game will await for the player
	 * to select reset to start a new game.
	 */
	function checkGameStatus(){
		checkLives = player.lives
		if (checkLives <=0){
			player.lives = 0;
			player.x = 200;
			player.y = 480;
			allEnemies = [];
			allGems = [];
		};
	};

    /* This function resets the game to initial conditions.
     */
    function reset() {
        player.lives = 3;
		player.score = 0;
		player.x = 200;
		player.y = 480;
		allEnemies = [];
		allGems = [];
		timeCount = 0;
    };

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
		'images/char-cat-girl.png',
		'images/char-horn-girl.png',
		'images/char-pink-girl.png',
		'images/char-princess-girl.png',
		'images/Gem Blue.png',
		'images/Gem Green.png',
		'images/Gem Orange.png',
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
	
//returns mouse position on canvas regardless of browser resizing.
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
	newX = evt.clientX - rect.left;
	newY = evt.clientY - rect.top;
	canvasPosition = [newX,newY];
	return canvasPosition;
}

/* event listeners for click events on canvas based on mouse position.
 * changes character image if user clicks on images at the bottom of the screen.
 * last if statement checks to see if user clicks reset button.
*/
canvas.addEventListener('click', function(evt) {
    var mousePos = getMousePos(canvas, evt);
    if (mousePos[1] > 700 && mousePos[1] < 800){
		if (mousePos[0] > 0 && mousePos[0] < 100){
			player.sprite = 'images/char-boy.png';
		} else if (mousePos[0] >= 100 && mousePos[0] < 200){
			player.sprite = 'images/char-cat-girl.png';
		} else if (mousePos[0] >= 200 && mousePos[0] < 300){
			player.sprite = 'images/char-horn-girl.png';
		} else if (mousePos[0] >= 300 && mousePos[0] < 400){
			player.sprite = 'images/char-pink-girl.png';
		} else if (mousePos[0] >= 400 && mousePos[0] < 500){
			player.sprite = 'images/char-princess-girl.png';
		};
	};
	//used for reset button check.
	if (mousePos[1] > 50 && mousePos[1] < 90){
		if (mousePos[0] > 0 && mousePos[0] < 70){
			reset();
		};
	};
	
  }, false);
//end of functions.
  
})(this);