class Enemy {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.sprite = 'images/enemy-bug.png';
        this.speed = (()=>
            (Math.random()+1) * 50
        )();
    
    }
    
    update(dt) {
        this.x +=this.speed*dt;
        if(this.x > 520) {
            this.x = -101;
        }
    }
    
    render() {
        const img = Resources.get(this.sprite);
        ctx.strokeRect(this.x,this.y,img.naturalWidth,img.naturalHeight);
        ctx.drawImage(img, this.x, this.y);
    }
 
}


class Player {
    constructor(x,y,lives = 3,score = 0) {
        this.x = x;
        this.y = y;
        this.sprite = 'images/char-boy.png';
        this.moveX = false;
        this.moveY = false;
        this.distance = 0;
        this.lives = 3;
        this.score = 0;
        
    }

    render(){
        const img = Resources.get(this.sprite);
        ctx.strokeRect(this.x,this.y,img.naturalWidth,img.naturalHeight);
        ctx.drawImage(img, this.x, this.y);
    }
    
    update() {

        if ( this.moveX ) {
            this.moveX = false;
            this.x += this.distance; 
            
        } else if ( this.moveY ) {
            this.moveY = false;
            this.y += this.distance; 
        }
      
        if(this.checkCollision()) {
            console.log('there was a collision,change player position')
            this.lives--;
            if (this.lives >= 0 ){
                const livesElement = document.querySelector('.lives-item');
                livesElement.innerHTML = this.lives;    
            } else {
                alert(`game finished, you got ${this.score}!!`);
                this.resetLives();
                this.resetScore();
            }
            this.gotoInitialPosition();
        }

        if(this.reachedWatter()) {

            this.score+= 100;
            const scoreElement = document.querySelector('.score-item');
            scoreElement.innerHTML = this.score;
            this.gotoInitialPosition();
        }
        
    }

    resetLives(){
        const livesElement = document.querySelector('.lives-item');
        livesElement.innerHTML = 3;    
        this.lives = 3;
    } 
    resetScore() {
        const scoreElement = document.querySelector('.score-item');
        scoreElement.innerHTML = 0;
        this.score = 0;
    }
    gotoInitialPosition() {
        this.x = 200;
        this.y = 450;
    }
    reachedWatter() {
        if(this.y <= 90) {
            return true;
        } else {
            return false;
        }
    }

    checkCollision(){
        let isCollision = false;
        const playerImg = Resources.get(this.sprite);
        const playerCoordinateY = this.y;
        const playerCoordinateX = this.x;
        allEnemies.forEach(function(enemy){
            const enemyImg =  Resources.get(enemy.sprite); 
            //down-left corner collision
            if( ( (enemy.y + enemyImg.naturalHeight > playerCoordinateY) && 
                    (enemy.y + enemyImg.naturalHeight < playerCoordinateY + playerImg.naturalHeight) ) 
                && 
                    ( (enemy.x > playerCoordinateX ) && 
                        (enemy.x < playerCoordinateX + playerImg.naturalWidth)
                ) ) {
                    console.log("collision");    
                    isCollision = true;
            //top-left corner collision
            } else if( ( (enemy.y > playerCoordinateY) && 
                            (enemy.y <playerCoordinateY + playerImg.naturalHeight) ) 
                      && 
                        ( (enemy.x > playerCoordinateX) && 
                            (enemy.x < playerCoordinateX + playerImg.naturalWidth) 
                ) ) {
                    console.log("collision"); 
                    isCollision = true;
            //down-right corner collision        
            } else if ( ( (enemy.x +enemyImg.naturalWidth > playerCoordinateX) && 
                            (enemy.x + enemyImg.naturalWidth < playerCoordinateX + playerImg.naturalWidth) )
                    && 
                        ( (enemy.y + enemyImg.naturalHeight > playerCoordinateY) && 
                            (enemy.y + enemyImg.naturalHeight < playerCoordinateY + playerImg.naturalHeight) 
                    ) ) {
                    console.log("collision"); 
                    isCollision = true;
            //up-right corner collision        
            } else if ( ( (enemy.x + enemyImg.naturalWidth > playerCoordinateX) && 
                            (enemy.x + enemyImg.naturalWidth < playerCoordinateX + playerImg.naturalWidth)) 
                    && 
                        ( (enemy.y > playerCoordinateY) && 
                            (enemy.y < playerCoordinateY + playerImg.naturalHeight)
                    ) ) {
                    console.log("collision"); 
                    isCollision = true;
            }  else {
                //isCollision = false;
            }
        
           
        });
        return isCollision;
    }

    handleInput(keyCode) {
        const img = Resources.get(this.sprite);
        const step = 20;
        switch(keyCode) {
            case 'left':
                if(this.x - step >= 0) {
                    this.moveX = true;
                    this.distance = -step;     
                    console.log('left x=',this.x);
                }
                
                break;
            case 'right':
                
                if(this.x + step + img.naturalWidth < ctx.canvas.width) {
                    this.moveX = true;
                    this.distance = step;
                    console.log('right x',this.x);
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
                    console.log('down y',this.y);

                }
                     
        }
    }

  

}




const player = new Player(200, 450);

const enemy1 = new Enemy(10,140);
const enemy2 = new Enemy(10,220);
const enemy3 = new Enemy(10,300);


const allEnemies = [enemy1,enemy2,enemy3];


document.addEventListener('keyup', function(e) {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
