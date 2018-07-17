// Enemies our player must avoid
class Enemy {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.sprite = 'images/enemy-bug.png';
        this.speed = (()=>
            (Math.random()+1) * 50
        )();
    }
    
    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
     // You should multiply any movement by the dt parameter
     // which will ensure the game runs at the same speed for
     // all computers.
        //console.log(dt);
        this.x +=this.speed*dt;
        if(this.x > 520) {
            this.x = -101;
        }
    }
    
    // Draw the enemy on the screen, required method for game   
    render() {
        const img = Resources.get(this.sprite);
        ctx.strokeRect(this.x,this.y,img.naturalWidth,img.naturalHeight);
        ctx.drawImage(img, this.x, this.y);
    }
 
}


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.sprite = 'images/char-boy.png';
        this.moveX = false;
        this.moveY = false;
        this.distance = 0;
        
    }

    render(){
        const img = Resources.get(this.sprite);
        ctx.strokeRect(this.x,this.y,img.naturalWidth,img.naturalHeight);
        ctx.drawImage(img, this.x, this.y);
    }
    
    // Update the player position, required method for game
    // Parameter: dt, a time delta between ticks
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    update() {
        //console.log(dt);
        if ( this.moveX ) {
            this.moveX = false;
            this.x += this.distance; 
            
        } else if ( this.moveY ) {
            this.moveY = false;
            this.y += this.distance; 
        }

        
        if(this.checkCollision()) {
            
            this.x = 200;
            this.y = 450;
        }

        
    }
    
    checkCollision(){
        let isCollision = false;
        const playerImg = Resources.get(this.sprite);
        const playerCoordinateY = this.y;
        const playerCoordinateX = this.x;
        allEnemies.forEach(function(enemy){
            const enemyImg =  Resources.get(enemy.sprite); 
            //console.log(`width:${img.naturalWidth},height:${img.naturalHeight}`); 
            //down-left corner collision
            if( ( (enemy.y + enemyImg.naturalHeight > playerCoordinateY) && 
                    (enemy.y + enemyImg.naturalHeight < playerCoordinateY + playerImg.naturalHeight) ) 
                && 
                    ( (enemy.x > playerCoordinateX ) && 
                        (enemy.x < playerCoordinateX + playerImg.naturalWidth)
                ) ) {
                    //console.log("collision");    
                    isCollision = true;
            //top-left corner collision
            } else if( ( (enemy.y > playerCoordinateY) && 
                            (enemy.y <playerCoordinateY + playerImg.naturalHeight) ) 
                      && 
                        ( (enemy.x > playerCoordinateX) && 
                            (enemy.x < playerCoordinateX + playerImg.naturalWidth) 
                ) ) {
                    //console.log("collision"); 
                    isCollision = true;
            //down-right corner collision        
            } else if ( ( (enemy.x +enemyImg.naturalWidth > playerCoordinateX) && 
                            (enemy.x + enemyImg.naturalWidth < playerCoordinateX + playerImg.naturalWidth) )
                    && 
                        ( (enemy.y + enemyImg.naturalHeight > playerCoordinateY) && 
                            (enemy.y + enemyImg.naturalHeight < playerCoordinateY + playerImg.naturalHeight) 
                    ) ) {
                    //console.log("collision"); 
                    isCollision = true;
            //up-right corner collision        
            } else if ( ( (enemy.x + enemyImg.naturalWidth > playerCoordinateX) && 
                            (enemy.x + enemyImg.naturalWidth < playerCoordinateX + playerImg.naturalWidth)) 
                    && 
                        ( (enemy.y > playerCoordinateY) && 
                            (enemy.y < playerCoordinateY + playerImg.naturalHeight)
                    ) ) {
                    //console.log("collision"); 
                    isCollision = true;
            }  else {
                isCollision = false;
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
        
                if (this.y - step > 0) {
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



// Now instantiate your objects.

// Place the player object in a variable called player
const player = new Player(200, 450);

const enemy1 = new Enemy(10,140);
const enemy2 = new Enemy(10,220);
const enemy3 = new Enemy(10,300);

// Place all enemy objects in an array called allEnemies
const allEnemies = [enemy1,enemy2,enemy3];


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
