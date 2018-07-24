let runGame = false;
let playerInitialPositionX = 215;
let playerInitialPositionY = 445;

//Global variables to use in engine.js for building the score panel
let globalScore = 0;
let globalLives = 5;
let globalLevel = 1;
let globalGems = 0;

const enemyRow1 = 140;
const enemyRow2 = 220;
const enemyRow3 = 300;


/**
 * Enemy class: class for the enemies(bugs)
 * it contains the positions(x,y), the image(sprite)
 * and the speed of the bugs
 */
class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.sprite = 'images/enemy-bug.png';
        this.speed = (() =>
            (Math.random() + 1) * 50
        )();

    }

    /**
     * Updates the position of the object on the canvas
     */
    update(dt) {
        this.x += this.speed * dt;
        if (this.x > 620) {
            this.x = -101;
            this.y = this.getRandomYposition();
            this.speed = this.getRandomSpeed();
        }
    }
    /**
     * Draws the sprite on the canvas
     */
    render() {
        const img = Resources.get(this.sprite);
        //ctx.strokeRect(this.x,this.y,img.naturalWidth,img.naturalHeight);
        ctx.drawImage(img, this.x, this.y);
    }

    /**
     * Give the enemy a position in three possible rows.
     * 140 first row of stones
     * 220 second row of stones
     * 300 third row of stones
     */
    getRandomYposition(){

        const number = Math.random();
        if(number < 0.33) {
            return enemyRow1;
        } else if (number < 0.66) {
            return enemyRow2;
        } else {
            return enemyRow3;
        }

    }

    /*
    * Gives the enemy a random speed once it is out of the boundaries of the canvas
    */   
    getRandomSpeed(){
        //random number between 0 and 2
        const randomNumber =Math.floor(Math.random() * Math.floor(3));
        switch (randomNumber) {
            case 0:
                return (Math.random() + 1) * 50;
            case 1:
                return 140;
            case 2:
                return 300;
            
        }


    }

}

/**
 * Class for the player. 
 * x and y are the properties for the position on the canvas
 * sprite is the image for the player to display. the 'move'
 * properties indicate whether the player made valid move
 * (a move inside the canvas limits). Lives and score are used
 * for the panel in the upper side.
 * 
 */
class Player {
    constructor(x, y, lives = 5, sprite ='images/char-boy.png', score = 0) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.moveX = false;
        this.moveY = false;
        this.distance = 0;
        this.lives = lives;
        this.score = score;

    }

    /**
     * Updates the position of the player on the canvas.
     * If there were movements in the x or y axis, the x 
     * property of Player gets updated accordingly by the 
     * distance.
     * After updating the coordinates, check for a collision with
     * the enemies or gems. If there is a collision with enemies,
     * the player go to the initial position.
     * It controls also the lives and the score when the player 
     * reaches a gem or the water.
     */
    update() {

        if (this.moveX) {
            this.moveX = false;
            this.x += this.distance;

        } else if (this.moveY) {
            this.moveY = false;
            this.y += this.distance;
        }

       
        if (this.checkCollision(allEnemies)) {
            console.log('there was a collision,change player position');
            this.lives--;
            globalLives = this.lives;
            if (this.isGameEnded()) {
                howlerObject.playEndGameSound();
                document.querySelector('.final-score').innerHTML = this.score;
                modalEndGame.style.display = 'block';
               
                this.resetLives();
                this.resetScore();
                initializeGems();
            } 
            this.gotoInitialPosition();
        }
        if(this.checkCollision(allGems)) {
            this.score += 200;
            globalScore = this.score; 
            globalGems++;       
        }
        if (this.reachedWater()) {

            this.score += 100;
            globalScore = this.score;
            globalLevel += 1;
            this.gotoInitialPosition();
            howlerObject.playReachedWaterSound();
            initializeGems();
            initializeEnemies(globalLevel);
            
        }

    }

    /**
     * Render the player according to its position
     */
    render() {
        const img = Resources.get(this.sprite);
        //ctx.strokeRect(this.x+17,this.y+17,img.naturalWidth-17,img.naturalHeight-17);
        ctx.drawImage(img, this.x, this.y);
    }

    /**
     * Check if the player still has lives
     */
    isGameEnded() {

        return this.lives < 0;

    }

    /**
     * Reset the lives property of the player
     */
    resetLives() {
       
        this.lives = 3;

    }

    /**
     * Reset the score property of the player 
     */
    resetScore() {
        
        this.score = 0;
    }

    /**
     * Updates player coordinates to the initial position
     */
    gotoInitialPosition() {
        this.x = playerInitialPositionX;
        this.y = playerInitialPositionY;
    }

    /**
     * Check if the player reached the water on the canvas
     */
    reachedWater() {
           return this.y <= 90 ? true:false;
    }

    /**
     * Check for a collision between the player and the enemies and gems. 
     * This method checks four areas: down left corner, up left corner,
     * down right corner and up right corner. If there is an overlap
     * between the player's and an the enemy's or gems' sprite, it will return
     * true, else will return false.
     */
    checkCollision(arrayOfObject) {
        let isCollision = false;
        const playerImg = Resources.get(this.sprite);
        const playerWidth = playerImg.naturalWidth - 17;
        const playerHeight = playerImg.naturalHeight - 17;
        const playerCoordinateY = this.y + 17;
        const playerCoordinateX = this.x + 17;
        arrayOfObject.forEach(function (object) {
            const enemyImg = Resources.get(object.sprite);
            //down-left corner collision
            if (((object.y + enemyImg.naturalHeight > playerCoordinateY) &&
                    (object.y + enemyImg.naturalHeight < playerCoordinateY + playerHeight)) &&
                ((object.x > playerCoordinateX) &&
                    (object.x < playerCoordinateX + playerWidth)
                )) {
                console.log("collision");
                isCollision = true;
                if(object instanceof Gem) {
                    object.x = -9999;
                    howlerObject.playGetGemSound();

                    console.log("collision with gem");
                } else {
                    howlerObject.playCollisionWithBugSound();
                }
            //top-left corner collision
            } else if (((object.y > playerCoordinateY) &&
                    (object.y < playerCoordinateY + playerHeight)) &&
                ((object.x > playerCoordinateX) &&
                    (object.x < playerCoordinateX + playerWidth)
                )) {
                console.log("collision");
                isCollision = true;
                if(object instanceof Gem) {
                    object.x = -9999;
                    console.log("collision with gem");
                    howlerObject.playGetGemSound();
                } else {
                    howlerObject.playCollisionWithBugSound();
                }
            //down-right corner collision        
            } else if (((object.x + enemyImg.naturalWidth > playerCoordinateX) &&
                    (object.x + enemyImg.naturalWidth < playerCoordinateX + playerWidth)) &&
                ((object.y + enemyImg.naturalHeight > playerCoordinateY) &&
                    (object.y + enemyImg.naturalHeight < playerCoordinateY + playerHeight)
                )) {
                console.log("collision");
                isCollision = true;
                if(object instanceof Gem) {
                    object.x = -9999;
                    console.log("collision with gem");
                    howlerObject.playGetGemSound();
                } else {
                    howlerObject.playCollisionWithBugSound();
                }
            //up-right corner collision        
            } else if (((object.x + enemyImg.naturalWidth > playerCoordinateX) &&
                    (object.x + enemyImg.naturalWidth < playerCoordinateX + playerWidth)) &&
                ((object.y > playerCoordinateY) &&
                    (object.y < playerCoordinateY + playerHeight)
                )) {
                console.log("collision");
                isCollision = true;
                if(object instanceof Gem) {
                    object.x = -9999;
                    console.log("collision with gem");
                    howlerObject.playGetGemSound();
                } else {
                    howlerObject.playCollisionWithBugSound();
                }
            } else {
                //isCollision = false;
            }


        });
        return isCollision;
    }

    /**
     * Controls the movement of the player within
     * the boundaries of the canvas
     * @param {key code when the user press a key} keyCode 
     */
    handleInput(keyCode) {
        const img = Resources.get(this.sprite);
        const stepVertical = 83;
        const stepHorizontal = 101;
        switch (keyCode) {
            case 'left':
                if (this.x - stepHorizontal >= 0) {
                    this.moveX = true;
                    this.distance = -stepHorizontal;
                    console.log('left x=', this.x);
                }

                break;
            case 'right':

                if (this.x + stepHorizontal + img.naturalWidth < ctx.canvas.width) {
                    this.moveX = true;
                    this.distance = stepHorizontal;
                    console.log('right x', this.x);
                }

                break;
            case 'up':

                if (this.y - stepVertical > 0) {
                    this.moveY = true;
                    this.distance = -stepVertical;
                    console.log('up y', this.y);
                }
                break;
            case 'down':

                if (this.y + stepVertical + img.naturalHeight < 580) {
                    this.moveY = true;
                    this.distance = stepVertical;
                    console.log('down y', this.y);

                }

        }
    }



}


/**
 * 
 */
class Gem {

    constructor(x = 0, y = 0 ) {
        this.x = x;
        this.y = y;
        this.sprite = 'images/gem-green.png';
    }

    /**
     * Updates the position of gems. Do nothing because gems don't move
     */
    update() {

    }

    /**
     * Draw each gem on the canvas
     */
    render() {
        const img = Resources.get(this.sprite);
        //ctx.strokeRect(this.x,this.y,img.naturalWidth,img.naturalHeight);
        ctx.drawImage(img,this.x,this.y);
        
    }

    /**
     * Static method that returns a different gem sprite: green, blue or orange
     * based on a random number
     */
    static getRandomSprite() {
        const randomNumber =Math.floor(Math.random() * Math.floor(3)+1);
        switch(randomNumber) {
            case 1:
                return 'images/gem-green.png';
            case 2: 
                return 'images/gem-blue.png';
            case 3:
                return 'images/gem-orange.png';
        }
    }
}

/**
 * Class to store the sounds of the game. It uses de Howler library
 * https://github.com/goldfire/howler.js for playing sounds
 */
class HowlerSounds {

    constructor() {
        this.gems = new Howl({
            src: ['../sounds/gem.mp3']
          });
        this.reachedWater = new Howl({
            src: ['../sounds/points.mp3']
        });  
        this.punch = new Howl({
            src: ['../sounds/punch.mp3']
        });  
        this.endGame = new Howl({
            src: ['../sounds/achievement.mp3']
        });  
        this.select = new Howl({
            src: ['../sounds/select.mp3'],
        });  
        this.backgroundMusic = new Howl({
            src: ['../sounds/LukHash_pixel_my_heart_trimmed.mp3'],
            loop: true,
            volume: 0.2
        });
    }
    playGetGemSound() {
        return this.gems.play();
    }
    playReachedWaterSound(){
        return this.reachedWater.play();
    }
    playCollisionWithBugSound(){
        return this.punch.play();
    }
    playEndGameSound() {
        return this.endGame.play();
    }
    playSelectSound() {
        return this.select.play();
    }
    playBackgroundMusic() {
        return this.backgroundMusic.play();
    }
    pauseBackgroundMusic() {
        return this.backgroundMusic.pause();
    }
}
//modal functionality
const modal = document.querySelector('.modal');
modal.addEventListener('keydown',trapkey);
let focusableElements = modal.querySelectorAll('img');
let firstTabStop = focusableElements[0];
let lastTabStop = focusableElements[focusableElements.length - 1];
modal.style.display = 'block';
const modalRectangles = modal.querySelector('.modal-rectangles');
const rectangles = modalRectangles.querySelectorAll('div');
for (let i = 0; i <= focusableElements.length-1; i++) {
     focusableElements[i].onfocus = handleFocus;
    
}
firstTabStop.focus();



//modal-end-game functionality
const modalEndGame = document.querySelector('.modal-end-game');
const toggleMusic = document.querySelector('.music');
toggleMusic.addEventListener('click',handleToggleMusic);

// instatiation of the player
const player = new Player(playerInitialPositionX,playerInitialPositionY);

//array of enemies
const allEnemies = [new Enemy(-100,enemyRow1),new Enemy(-40,enemyRow2)];
initializeEnemies(globalLevel);




let allGems;
initializeGems();


//create Howler object
const howlerObject = new HowlerSounds();


//Algorithm for presenting enemies on the screen
//as the level increses, more enemies are added
function initializeEnemies(level) {

    if (level >= 3 && level <= 4) {
        if (Math.random() >= 0.60) {
            allEnemies.push(new Enemy(-70, enemyRow1),new Enemy(-60, enemyRow2));
        }
    } else if (level > 4 && level <= 8) {
        if (Math.random() >= 0.60) {
            allEnemies.push(new Enemy(-100, enemyRow3));
        }
    } else if (level >8) {
        if (Math.random() >= 0.70) {
            allEnemies.push(new Enemy(-200, enemyRow3));
        }

    }


}

//this function places gems on the rocks
function initializeGems() {
    allGems = []; 
    for (let row = 0;row<3;row++) {
        //number between 1-3 for this row
        const randomNumber =Math.floor(Math.random() * Math.floor(3)+1);
        let counter =0;
        for (let col = 0; col<5; col++) {
            if(counter == randomNumber) {
                continue;
            }
            //number between 1-3
            const randomYesNo =Math.floor(Math.random() * Math.floor(2)+1);
            //1 yes, put object into array, 2 skip it
            if (randomYesNo === 1 ) {
                //x coordinate 25 = 101/2 - 50/2; 50 is the width of the sprite
                //y coordinate 148 = 83 + 65; 65 by testing
                const gem = new Gem(25.5 +(col*101),148 + (row * 83) );
                gem.sprite = Gem.getRandomSprite();
                allGems.push(gem);
                counter++;        
            }
    
    
        }
    }
}


// Callback to handle focus in the modal
// at the beginning of the game. It places
// a rectangle underneath the player.
function handleFocus(e){

    console.log(e);

    for(let i =0; i <= focusableElements.length - 1;i++) {
        if( focusableElements[i] === document.activeElement ) {
            rectangles[i].classList.add('show');
            
        } else {
            rectangles[i].classList.remove('show');
        }
    }

}


/**
 * Inside the modal to chose a player, controls the focus of each image
 * using the trap pattern. If the player hits enter, the game starts.
 */
function trapkey(e){
    console.log(e.keyCode);
    
    if(e.keyCode == 9) {
        
        // SHIFT + TAB
        if (e.shiftKey) {
            if (document.activeElement === firstTabStop) {
                e.preventDefault();
                lastTabStop.focus();
            }
        // TAB
        } else {
            if (document.activeElement === lastTabStop) {
                e.preventDefault();
                firstTabStop.focus();
            }
        }
    }
    //ENTER
    if(e.keyCode == 13) {
     
        const el = document.activeElement;
        player.sprite =el.getAttribute('src');
        modal.removeEventListener('keydown',trapkey);
        modal.style.display = 'none';
        howlerObject.playSelectSound();
        howlerObject.playBackgroundMusic();
        runGame = true;

        
    }

}


/**
 * Event listener for the keyboard. Only certain 
 * keys that corresponds to the arrow key in the keyboar
 * are allowed
 */
document.addEventListener('keyup', function (e) {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});


/**
 * Toggles music on or off, pausing of playing the background
 * music
 */
function handleToggleMusic(){
    if(toggleMusic.innerHTML === 'music on') {
        toggleMusic.innerHTML = 'music off';
        howlerObject.pauseBackgroundMusic();
    } else {
        toggleMusic.innerHTML = 'music on';
        howlerObject.playBackgroundMusic();
    }
     


}
