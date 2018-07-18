/**
 * Eneny class: class for the enemies(bugs)
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
        }
    }
    /**
     * draws the sprite on the canvas
     * 
     * @return  {[void]}
     */
    render() {
        const img = Resources.get(this.sprite);
        ctx.drawImage(img, this.x, this.y);
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
    constructor(x, y, lives = 3, score = 0) {
        this.x = x;
        this.y = y;
        this.sprite = 'images/char-boy.png';
        this.moveX = false;
        this.moveY = false;
        this.distance = 0;
        this.lives = 3;
        this.score = 0;

    }

    /**
     * updates the position of the player on the canvas.
     * If there were movements in the x or y axis, the x 
     * property of Player gets uddated accordingly by the 
     * distance(always 20px)
     * After updating the coordinates, check for a collision with
     * the enemies. If there is a collision the player go to the
     * initial position. It controls also the lives and the score
     */
    update() {

        if (this.moveX) {
            this.moveX = false;
            this.x += this.distance;

        } else if (this.moveY) {
            this.moveY = false;
            this.y += this.distance;
        }

        if (this.checkCollision()) {
            console.log('there was a collision,change player position')
            this.lives--;
            if (!this.isGameEnded()) {
                const livesElement = document.querySelector('.lives-item');
                livesElement.innerHTML = this.lives;
            } else {
                alert(`game finished, you got ${this.score}!!`);
                this.resetLives();
                this.resetScore();
            }
            this.gotoInitialPosition();
        }

        if (this.reachedWatter()) {

            this.score += 100;
            const scoreElement = document.querySelector('.score-item');
            scoreElement.innerHTML = this.score;
            this.gotoInitialPosition();
        }

    }

    /**
     * check if the player still has lives
     */
    isGameEnded() {

        return this.lives < 0;

    }
    /**
     * render the player according to its position
     */
    render() {
        const img = Resources.get(this.sprite);
        ctx.drawImage(img, this.x, this.y);
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
        this.x = 200;
        this.y = 450;
    }

    /**
     * check if the player reached the water on the canvas
     */
    reachedWatter() {
        if (this.y <= 90) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * check for a collision between the player and the enemies. 
     * This method checks for areas: down left corner, up left corner
     * down right corner and up right corner. If there is an overlap
     * between the player's and an the enemy's sprite, it will return
     * true, else will return false.
     */
    checkCollision() {
        let isCollision = false;
        const playerImg = Resources.get(this.sprite);
        const playerCoordinateY = this.y;
        const playerCoordinateX = this.x;
        allEnemies.forEach(function (enemy) {
            const enemyImg = Resources.get(enemy.sprite);
            //down-left corner collision
            if (((enemy.y + enemyImg.naturalHeight > playerCoordinateY) &&
                    (enemy.y + enemyImg.naturalHeight < playerCoordinateY + playerImg.naturalHeight)) &&
                ((enemy.x > playerCoordinateX) &&
                    (enemy.x < playerCoordinateX + playerImg.naturalWidth)
                )) {
                console.log("collision");
                isCollision = true;
                //top-left corner collision
            } else if (((enemy.y > playerCoordinateY) &&
                    (enemy.y < playerCoordinateY + playerImg.naturalHeight)) &&
                ((enemy.x > playerCoordinateX) &&
                    (enemy.x < playerCoordinateX + playerImg.naturalWidth)
                )) {
                console.log("collision");
                isCollision = true;
                //down-right corner collision        
            } else if (((enemy.x + enemyImg.naturalWidth > playerCoordinateX) &&
                    (enemy.x + enemyImg.naturalWidth < playerCoordinateX + playerImg.naturalWidth)) &&
                ((enemy.y + enemyImg.naturalHeight > playerCoordinateY) &&
                    (enemy.y + enemyImg.naturalHeight < playerCoordinateY + playerImg.naturalHeight)
                )) {
                console.log("collision");
                isCollision = true;
                //up-right corner collision        
            } else if (((enemy.x + enemyImg.naturalWidth > playerCoordinateX) &&
                    (enemy.x + enemyImg.naturalWidth < playerCoordinateX + playerImg.naturalWidth)) &&
                ((enemy.y > playerCoordinateY) &&
                    (enemy.y < playerCoordinateY + playerImg.naturalHeight)
                )) {
                console.log("collision");
                isCollision = true;
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
        const step = 20;
        switch (keyCode) {
            case 'left':
                if (this.x - step >= 0) {
                    this.moveX = true;
                    this.distance = -step;
                    console.log('left x=', this.x);
                }

                break;
            case 'right':

                if (this.x + step + img.naturalWidth < ctx.canvas.width) {
                    this.moveX = true;
                    this.distance = step;
                    console.log('right x', this.x);
                }

                break;
            case 'up':

                if (this.y - step > 50) {
                    this.moveY = true;
                    this.distance = -step;
                    console.log('up y', this.y);
                }
                break;
            case 'down':

                if (this.y + step + img.naturalHeight < 580) {
                    this.moveY = true;
                    this.distance = step;
                    console.log('down y', this.y);

                }

        }
    }



}



// instatiation of the player
const player = new Player(200, 450);

// instantiation of the enemies
const enemy1 = new Enemy(10, 140);
const enemy2 = new Enemy(10, 220);
const enemy3 = new Enemy(10, 300);

//array of enemies
const allEnemies = [enemy1, enemy2, enemy3];

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