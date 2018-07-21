let userSelectedPlayer = false;
let playerInitialPositionX = 215
let playerInitialPositionY = 445;

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
     * updates the position of the object on the canvas
     */
    update(dt) {
        this.x += this.speed * dt;
        if (this.x > 520) {
            this.x = -101;
            this.y = this.getRandomYposition();
            this.speed = this.getRandomSpeed();
        }
    }
    /**
     * draws the sprite on the canvas
     */
    render() {
        const img = Resources.get(this.sprite);
       // ctx.strokeRect(this.x,this.y,img.naturalWidth,img.naturalHeight);
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
            return 140;
        } else if (number < 0.66) {
            return 220;
        } else {
            return 300;
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
 * class for the player. 
 * x and y are the properties for the position on the canvas
 * sprite is the image for the player to display. the 'move'
 * properties indicate whether the player made valid move
 * (a move inside the canvas limits). Lives and score are used
 * for the panel in the upper side.
 * 
 */
class Player {
    constructor(x, y, lives = 3, sprite ='images/char-boy.png', score = 0) {
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
     * updates the position of the player on the canvas.
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
            console.log('there was a collision,change player position')
            this.lives--;
            if (!this.isGameEnded()) {
                const livesElement = document.querySelector('.lives-item');
                livesElement.innerHTML = this.lives;
            } else {
                alert(`game finished, you got ${this.score}!!`);
                this.resetLives();
                this.resetScore();
                initializeGems();
            }
            this.gotoInitialPosition();
        }
        if(this.checkCollision(allGems)) {
            this.score += 200;        
            document.querySelector('.score-item').innerHTML = this.score;
        }
        if (this.reachedWater()) {

            this.score += 100;
            document.querySelector('.score-item').innerHTML = this.score
            this.gotoInitialPosition();
        }

    }

    /**
     * render the player according to its position
     */
    render() {
        const img = Resources.get(this.sprite);
      //  ctx.strokeRect(this.x,this.y,img.naturalWidth,img.naturalHeight);
        ctx.drawImage(img, this.x, this.y);
    }

    /**
     * check if the player still has lives
     */
    isGameEnded() {

        return this.lives < 0;

    }

    /**
     * reset the live span in score panel and the lives 
     * property of the player 
     */
    resetLives() {
        const livesElement = document.querySelector('.lives-item');
        livesElement.innerHTML = 3;
        this.lives = 3;
    }

    /**
     * reset the score span in score panel and the score 
     * property of the player 
     */
    resetScore() {
        const scoreElement = document.querySelector('.score-item');
        scoreElement.innerHTML = 0;
        this.score = 0;
    }

    /**
     * updates player coordinates to the initial position
     */
    gotoInitialPosition() {
        this.x = playerInitialPositionX;
        this.y = playerInitialPositionY;
    }

    /**
     * check if the player reached the water on the canvas
     */
    reachedWater() {
           return this.y <= 90 ? true:false;
    }

    /**
     * check for a collision between the player and the enemies and gems. 
     * This method checks four areas: down left corner, up left corner
     * down right corner and up right corner. If there is an overlap
     * between the player's and an the enemy's or gems' sprite, it will return
     * true, else will return false.
     */
    checkCollision(arrayOfObject) {
        let isCollision = false;
        const playerImg = Resources.get(this.sprite);
        const playerCoordinateY = this.y;
        const playerCoordinateX = this.x;
        arrayOfObject.forEach(function (object) {
            const enemyImg = Resources.get(object.sprite);
            //down-left corner collision
            if (((object.y + enemyImg.naturalHeight > playerCoordinateY) &&
                    (object.y + enemyImg.naturalHeight < playerCoordinateY + playerImg.naturalHeight)) &&
                ((object.x > playerCoordinateX) &&
                    (object.x < playerCoordinateX + playerImg.naturalWidth)
                )) {
                console.log("collision");
                isCollision = true;
                if(object instanceof Gem) {
                    object.x = -9999;
                    console.log("collision with gem");
                }
            //top-left corner collision
            } else if (((object.y > playerCoordinateY) &&
                    (object.y < playerCoordinateY + playerImg.naturalHeight)) &&
                ((object.x > playerCoordinateX) &&
                    (object.x < playerCoordinateX + playerImg.naturalWidth)
                )) {
                console.log("collision");
                isCollision = true;
                if(object instanceof Gem) {
                    object.x = -9999;
                    console.log("collision with gem");

                }
            //down-right corner collision        
            } else if (((object.x + enemyImg.naturalWidth > playerCoordinateX) &&
                    (object.x + enemyImg.naturalWidth < playerCoordinateX + playerImg.naturalWidth)) &&
                ((object.y + enemyImg.naturalHeight > playerCoordinateY) &&
                    (object.y + enemyImg.naturalHeight < playerCoordinateY + playerImg.naturalHeight)
                )) {
                console.log("collision");
                isCollision = true;
                if(object instanceof Gem) {
                    object.x = -9999;
                    console.log("collision with gem");

                }
            //up-right corner collision        
            } else if (((object.x + enemyImg.naturalWidth > playerCoordinateX) &&
                    (object.x + enemyImg.naturalWidth < playerCoordinateX + playerImg.naturalWidth)) &&
                ((object.y > playerCoordinateY) &&
                    (object.y < playerCoordinateY + playerImg.naturalHeight)
                )) {
                console.log("collision");
                isCollision = true;
                if(object instanceof Gem) {
                    object.x = -9999;
                    console.log("collision with gem");

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
     * updates the position of gems. Do nothing because gems don't move
     */
    update() {

    }

    /**
     * draw each gem on the canvas
     */
    render() {
        const img = Resources.get(this.sprite);
        //ctx.strokeRect(this.x,this.y,img.naturalWidth,img.naturalHeight);
        ctx.drawImage(img,this.x,this.y);
        
    }

    /**
     * static method that returns a different gem sprite: green, blue or orange
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
                return 'images/gem-orange.png'
        }
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

// instatiation of the player
//const player = new Player(220, 470);
const player = new Player(playerInitialPositionX,playerInitialPositionY);

// instantiation of the enemies
const enemy1 = new Enemy(10, 140);
const enemy2 = new Enemy(-10, 220);
const enemy3 = new Enemy(10, 300);
const enemy4 = new Enemy(-200,140);
const enemy5 = new Enemy(-300,220);

//array of enemies
const allEnemies = [enemy1, enemy2, enemy3,enemy4,enemy5];

//array of gems
//const gem1 = new Gem(25.5,148);

let allGems;

initializeGems();

 
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
                const gem = new Gem(25.5 +(col*101),148 + (row * 83) )
                gem.sprite = Gem.getRandomSprite();
                allGems.push(gem);
                counter++;        
            }
    
    
        }
    }
}

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
 * inside de modal to chose a player, controls the focus of each image
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
        modal.style.display = 'none';
        userSelectedPlayer = true;

        
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