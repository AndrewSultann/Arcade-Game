"use strict"

// Enemies our player must avoid
let Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.step = 101;
    this.height = 60;
    this.width= 60;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
// You should multiply any movement by the dt parameter
// which will ensure the game runs at the same speed for
// all computers.
Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;
    if (this.x > this.step * 5){
        this.y = randomRow();
        this.x = -this.step;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// the returned value is used to set a new Y position for each enemy that reaches the end
function randomRow(){
    var rows = [58, 145, 230, 315, 398]
    var random = Math.round(Math.random()*4) 
    return rows[random]
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
// a reset() method "when collides or reaches the end"
class Player {
    constructor(score){
        this.jump = 85;
        this.step = 101;
        this.x = this.step * 2;
        this.y = this.jump * 6 - 15;
        this.x2 = 0 ;
        this.y2 = 0;
        this.sprite= 'images/char-horn-girl.png';
        this.height = 60;
        this.width= 60;
        this.score= 0;
        this.highScore= 0;
        this.lives= 3
    }
    render(){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y)
    }
    update(){
        // i could have used this funtion on handleInput , but the instructions says that
        // i should put all functions considering the player movement in update() !!
        this.x += this.x2;
        this.x2 = 0;
        this.y += this.y2;
        this.y2 = 0;

        // check collision 
        for(let enemy of allEnemies){
            if(player.x < enemy.x + enemy.width && player.x + player.width > enemy.x && player.y < enemy.y + enemy.height && player.y + player.height > enemy.y){
                this.lives -= 1;
                // setTimeout(this.reset.bind(player), 2000);
                this.reset()
            }
        }
        //check for win 
        if (this.y < 70){
            this.score += 1000;
            //if player enter the selector door it will change its char        
            if(this.x < selector.x + selector.width && this.x + this.width > selector.x && this.y < selector.y + selector.height && this.y + this.height > selector.y){
                this.sprite= this.chars();
            }
            this.reset();
        }; 
    }
    // a method to interpret the pressed key and add a value to X or Y position
    handleInput(keys){
        switch(keys){
            case 'up':{
                this.y2 = -this.jump;
                break;
            }                  
            case 'down':{
                if(this.y < this.jump * 5){
                    this.y2 = this.jump;
                }
                break;             
            }
            case 'right':{
                if(this.x < this.step * 4){
                    this.x2 = this.step;
                }
                break;
            }
            case 'left':{
                if(this.x > 0){
                    this.x2 = -this.step;
                }
                break;
            }
        }
    }
    scores(){
        // A method for scoring system
        let scoreDis = document.getElementById('scoreDisplay');
        let hScoreDis = document.getElementById('hScoreDisplay');
        let liveDis = document.getElementById('lives');
        scoreDis.textContent = this.score;
        hScoreDis.textContent = this.highScore;     
        liveDis.textContent = this.lives;  

        if (this.score > this.highScore) {
            this.highScore = this.score;
        }
        if (this.lives <= 0){   
            liveDis.textContent = "Game Over!"; 
            // after 2 secs it will return the lives to 3
            // the score will be equal zero only after game over
            let that = this;
            setTimeout(function(){ that.lives = 3}, 1500);
            this.score = 0;
            allGems.forEach(function(gem) {
                gem.resetGems();
            });  
        }   
    }
    chars(){
        let characters = ['images/char-boy.png', 'images/char-horn-girl.png', 
        'images/char-cat-girl.png','images/char-pink-girl.png', 'images/char-princess-girl.png']
        let random = Math.round(Math.random()*4)
        // the if condition is to avoid repeating of chaacaters 
        if (characters[random]!==this.sprite){
            return characters[random]
   // I thought i won't need the else statement , is there something not right in my function
        } else {
            return characters[random-1]
        }     
    }
    reset(){
        this.x = this.step * 2;
        this.y = this.jump * 6 - 15;
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const bug1 = new Enemy(-101, 58, 160),
      bug2 = new Enemy(-101, 143, 240),
      bug3 = new Enemy(-101, 228, 220),
      bug4 = new Enemy(-101, 313, 300),
      bug5 = new Enemy(-101, 398, 280),
      player = new Player();

const allEnemies = [bug1, bug2, bug3, bug4, bug5]

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

// the original array 
let sprites = ['images/gem-blue.png', 'images/gem-orange.png', 'images/gem-green.png'];
// a copy of the array
let newArray = [];
// a function to get a random img for gems each time it's called
function getRandomImg(){
    if (newArray.length == 0){
        for(let i = 0 ; i< sprites.length ; i++){
            newArray.push(sprites[i])
        }
    }
    // when the function called choose a random number (0 or 1 or 2)
    let index = Math.floor(Math.random() * newArray.length)
    // get an item from the copied array with the random number index EX: 2;
    let randomImage = newArray[index];
    // remove the choosen item from the array 
    newArray.splice(index, 1);
    return randomImage;
}

// class for gems 
class Gem {
    constructor(points){
        this.x = getRandomInt(0, 404);
        this.y = getRandomInt(70, 410);
        this.points = points;
        this.originalPoints = points
        this.sprite = getRandomImg();
        this.width= 50;
        this.height= 50;
    }
    render(){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y)
    }
    update(){
       // Taking Gems
       if(player.x < this.x + this.width && player.x + player.width > this.x && player.y < this.y + this.height && player.y + player.height > this.y){
           this.sprite='images/Rock.png';
           player.score += this.points;
           this.points =0;
       }
    }
    resetGems(){
        this.x = getRandomInt(0, 404);
        this.y = getRandomInt(70, 410);
        this.sprite = getRandomImg();
        // so I can set the points again each round 
        this.points = this.originalPoints;  
    }
}

const gemBlue = new Gem(500),
      gemOrange = new Gem(300),
      gemGreen = new Gem(200);

const allGems = [gemBlue, gemGreen, gemOrange]

//Range of x 0 to 404
//Range of y 70 to 410
//function to get random number within a range
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.round(Math.random() * (max - min + 1)) + min;
}

// Constructor for the Selector door 
let Selector = function(){
    this.x = 405;
    this.y = -38;
    this.width= 50;
    this.height= 50;
    this.sprite = 'images/Selector.png'
}

Selector.prototype.render=function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y)
}

const selector = new Selector;


// used this to disable arrow keys from scrolling the browser 
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);