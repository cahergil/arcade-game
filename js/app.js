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
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
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
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
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


        
    }

    handleInput(keyCode) {
        let canvas = document.querySelector('canvas');
        switch(keyCode) {
            case 'left':
                if(this.x - 20 >= 0) {
                    this.moveX = true;
                    this.distance = -20;     
                    console.log('left x=',this.x);
                }
                
                break;
            case 'right':
                
                if(this.x + 20 < 420) {
                    this.moveX = true;
                    this.distance = 20;
                    console.log('right x',this.x);
                }
               
                break;
            case 'up':
        
                if (this.y - 20 > 0) {
                    this.moveY = true;
                    this.distance = -20;
                    console.log('up y', this.y);
                }
                break;
            case 'down':
                
                if (this.y + 20 < 440) {
                    this.moveY = true;
                    this.distance = 20;     
                    console.log('down y',this.y);

                }
                     
        }
    }
}



// Now instantiate your objects.

// Place the player object in a variable called player
const player = new Player(200, 400);

const enemy1 = new Enemy(10,60);
const enemy2 = new Enemy(10,150);
const enemy3 = new Enemy(10,225);

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
