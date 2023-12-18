'use strict';

let ctx;

let gameOver = false;

let trapDown = false;
let powerDown = false;
let powerOn = false;

let canMove = true;

let game = new Layout();
let player = new Player();
let goal = new Goal();
let enemy = new Enemy();

let minDistance = 180;

let scoreOutput = document.getElementById('objective');
let scoreCount = 0;

let movesHeader = document.getElementById('movesOutput');
let movesOutput = [];

let powerMoves = document.getElementById('powerMoves');

let animation = -1;

//called onload, call coordinates/draw functions.
function setup() {
    updateDate();
    
    let canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    
    scoreOutput = document.getElementById('objective');
    movesHeader = document.getElementById('movesOutput');
    powerMoves = document.getElementById('powerMoves');
    
    powerMoves.innerHTML = 'Power Moves Left: ' + player.powerMoves;
    
    clearCanvas();
    
    game.treeCoords();
    enemy.enemyCoords();
    goal.objectiveCoords();
    
    game.drawGrid();
    game.drawTrees();
    goal.drawObjective();
    enemy.drawEnemies();
    player.drawPlayer();
}

//clear the entire canvas.
function clearCanvas() {
    ctx.clearRect(0, 0, 600, 600);
}

//board Constructor
function Layout() {
    //draw the main grid.
    this.drawGrid = function() {
        let col = 60;
        let row = 60;
    
        for (let line = 1; line < 10; line++) {
            ctx.beginPath();
            ctx.strokeStyle = 'white';
            ctx.lineTo(col, 0);
            ctx.lineTo(col, 600);
            ctx.stroke();
    
            col += 60;
        }
    
        for (let line = 1; line < 10; line++) {
            ctx.beginPath();
            ctx.strokeStyle = 'white';
            ctx.lineTo(0, row);
            ctx.lineTo(600, row);
            ctx.stroke();
    
            row += 60;
        }
    }

    this.treeX = []; 
    this.treeY = [];

    //checks and generates then push X and Y for treeX and treeY arrays.
    this.treeCoords = function() {        
        for (let index = 0; index < 15; index++) {
            let x;
            let y;

            do {
                x = randomCord();
                y = randomCord();
            } while (
                (calculateDistance(x, y, player.x, player.y) < minDistance) ||
                (checkTree(x, y))
            );
    
            this.treeX.push(x);
            this.treeY.push(y);
        }
    }

    //draw obstacles, "trees".
    this.drawTrees = function() {
        for (let index = 0; index < this.treeX.length; index++) {
            ctx.save();
            ctx.translate(this.treeX[index], this.treeY[index] + 30);
            
            //bottom
            ctx.beginPath();
            ctx.fillStyle = 'saddlebrown'
            ctx.strokeStyle = 'white';
            ctx.rect(+5, -5, -10, -30);
            ctx.fill();
            ctx.stroke();
    
            //top
            ctx.beginPath();
            ctx.fillStyle = 'forestgreen';
            ctx.strokeStyle = 'white';
            ctx.rect(+15, -50, -30, 25);
            ctx.fill();
            ctx.stroke();
    
            ctx.restore();
        }
    }

    //stops the game and shows gameover message.
    this.gameOver = function() {
        gameOver = true;
       
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.rect(0,0, 600, 600);
        ctx.fill();

        ctx.font = '90px Georgia';
        ctx.fillStyle = 'red';
        ctx.fillText('GAME OVER', 30, 330);
        ctx.restore();
    }

    //reset to original values.
    this.reset = function() {
        game.drawGrid();
        game.treeX = [];
        game.treeY = [];
        game.treeCoords();
    }
}

//player Constructor.
function Player() {
    this.x = 30;
    this.y = 30;
    this.moves = [];
    this.moveIndex = 0;

    //draw player, "fox".
    this.drawPlayer = function () {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        //fox's face
        ctx.beginPath();
        ctx.fillStyle = 'orange';
        ctx.strokeStyle = 'white';
        ctx.lineTo(-20, -5);
        ctx.lineTo(+20, -5);
        ctx.lineTo(0, +20);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        //left ear
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'white';
        ctx.lineTo(-20, -5);
        ctx.lineTo(-10, -20);
        ctx.lineTo(0, -5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.rect(-13, -12, 5, 5);
        ctx.fill();

        //right ear
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'white';
        ctx.lineTo(+20, -5);
        ctx.lineTo(+10, -20);
        ctx.lineTo(0, -5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.rect(+8, -12, 5, 5);
        ctx.fill();

        //left left eye
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.rect(-8, +1, 5, 5);
        ctx.fill();

        //left right eye
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.rect(+4, +1, 5, 5);
        ctx.fill();

        //nose
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.lineTo(-4, +15);
        ctx.lineTo(+4, +15);
        ctx.lineTo(0, +20);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }

    this.trapX = -500;
    this.trapY = -500;

    //draw player trap.
    this.drawTrap = function() {
        ctx.save();
        ctx.translate(this.trapX, this.trapY);
        
        //base
        ctx.beginPath();
        ctx.fillStyle = 'LightSlateGrey';
        ctx.strokeStyle = 'white';
        ctx.rect(-20, 20, 40, -12)
        ctx.fill();
        ctx.stroke();

        //trap's teth1
        ctx.beginPath();
        ctx.fillStyle = 'LightSlateGrey';
        ctx.strokeStyle = 'white';
        ctx.lineTo(-20, +8);
        ctx.lineTo(-15, -10);
        ctx.lineTo(-10, +8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        //trap's teth2
        ctx.beginPath();
        ctx.fillStyle = 'LightSlateGrey';
        ctx.strokeStyle = 'white';
        ctx.lineTo(-10, +8);
        ctx.lineTo(-5, -10);
        ctx.lineTo(0, +8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        //trap's teth3
        ctx.beginPath();
        ctx.fillStyle = 'LightSlateGrey';
        ctx.strokeStyle = 'white';
        ctx.lineTo(0, +8);
        ctx.lineTo(+5, -10);
        ctx.lineTo(+10, +8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        //trap's teth3
        ctx.beginPath();
        ctx.fillStyle = 'LightSlateGrey';
        ctx.strokeStyle = 'white';
        ctx.lineTo(+10, +8);
        ctx.lineTo(+15, -10);
        ctx.lineTo(+20, +8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }

    this.powerFirstX = -1000;
    this.powerFirstY = -1000;

    this.powerX;
    this.powerY;

    this.powerMoves = 0;

    //generate the coordinates for  super power.
    this.powerCoords = function() {
        let x;
        let y;

        do {
            x = randomCord();
            y = randomCord();
        } while (
            (checkEnemy(x, y)) ||
            (checkTree(x, y)) ||
            (calculateDistance(x, y, this.x, this.y) < minDistance) ||
            (calculateDistance(x, y, goal.x, goal.y) < minDistance) ||
            (calculateDistance(x, y, this.trapX, this.trapY) < minDistance) 
        );

        this.powerX = x;
        this.powerY = y;
    }

    //generates the chance of power showing up.
    this.powerChance = function() {
        let chance = Math.random();

        if (chance >= 0 && chance <= 0.10) {
            return true;
        } else {
            return false;
        }
    }
    
    //draw super power.
    this.drawSuperPower = function() {
        ctx.save();
        ctx.translate(this.powerX, this.powerY);

        //grapes
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'Purple';
        ctx.arc(-11, -5, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, -5, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(+11, -5, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(-6, +5, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(+6, +5, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, +15, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();    
        
        //vine
        ctx.lineWidth = 10;
        ctx.rotate(45 * Math.PI / 180);
        ctx.beginPath();
        ctx.arc(-6, -17, 5, 100 * Math.PI / 180, 260 * Math.PI / 180);
        ctx.stroke();

        ctx.restore();
    }

    //reset to original values.
    this.reset = function() {
        player.moves = [];
        player.moveIndex = 0;
        player.x = 30;
        player.y = 30;
        this.powerMoves = 0;
    }
}

//objective Constructor
function Goal() {
    this.x;
    this.y;

    //checks and generates X and Y for the rabbit.
    this.objectiveCoords = function() {
        let x;
        let y;

        do {
            x = randomCord();
            y = randomCord();
        } while (
            (checkTree(x, y)) ||
            (checkEnemy(x, y)) ||
            (calculateDistance(x, y, player.x, player.y) < minDistance) ||
            (calculateDistance(x, y, player.trapX, player.trapY) < minDistance) ||
            (calculateDistance(x, y, player.powerX, player.powerY) < minDistance) 
        );

        this.x = x;
        this.y = y;
    }
    
    //draw objective, "rabbit".
    this.drawObjective = function() {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        //left ear
        ctx.beginPath();
        ctx.fillStyle = 'lightGrey';
        ctx.strokeStyle = 'white';
        ctx.lineTo(-14, -5);
        ctx.lineTo(-10, -25);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.rect(-11, -12, 5, 5);
        ctx.fill();
    
        //right ear
        ctx.beginPath();
        ctx.fillStyle = 'lightGrey';
        ctx.strokeStyle = 'white';
        ctx.lineTo(+14, -5);
        ctx.lineTo(+10, -25);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.rect(+6, -12, 5, 5);
        ctx.fill();
    
        //rabbit's face
        ctx.beginPath();
        ctx.fillStyle = 'lightGrey';
        ctx.strokeStyle = 'white';
        ctx.arc(0, +7, 17, 0 , Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    
        //left left eye
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.rect(-8, 0, 5, 5);
        ctx.fill();
    
        //left right eye
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.rect(+4, 0, 5, 5);
        ctx.fill();
        
        //nose
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.rect(-2, +6, 5, 5);
        ctx.fill();
    
        //mouth
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.arc(-3, +17, 3, 180 * Math.PI / 180, 360 * Math.PI /180);
        ctx.stroke();
    
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.arc(+3, +17, 3, 180 * Math.PI / 180, 360 * Math.PI /180);
        ctx.stroke();
    
        ctx.restore();
    }
}

//enemy Constructor
function Enemy() {
    this.x = [];
    this.y = [];
    this.moves = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    this.count = 1;

    //checks and generates X and Y for the enemy.
    this.enemyCoords = function() {
        for (let index = this.count; index == this.count; index++) {
           let x;
           let y;
           do {
               x = randomCord();
               y = randomCord();
           } while (
               (checkEnemy(x, y)) ||
               (checkTree(x, y)) ||
               (calculateDistance(x, y, player.x, player.y) < minDistance) ||
               (calculateDistance(x, y, goal.x, goal.y) < minDistance) ||
               (calculateDistance(x, y, player.trapX, player.trapY) < minDistance)  ||
               (calculateDistance(x, y, player.powerX, player.powerY) < minDistance) 
           );
           this.x.push(x);
           this.y.push(y);
        }
    }

    //draw the enemy, "hunter".
    this.drawEnemies = function() {
        for (let index = 0; index < this.x.length; index++) {
            ctx.save();
            ctx.translate(this.x[index], this.y[index]);
            
            //face
            ctx.beginPath();
            ctx.fillStyle = 'Tan';
            ctx.strokeStyle = 'white';
            ctx.arc(0, 0, 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        
            //left eyebrown
            ctx.beginPath();
            ctx.strokeStyle = 'SaddleBrown';
            ctx.lineWidth = 3;
            ctx.lineTo(-12, -10);
            ctx.lineTo(-2, -7);
            ctx.stroke();
        
            //right eyebrown
            ctx.beginPath();
            ctx.strokeStyle = 'SaddleBrown';
            ctx.lineWidth = 3;
            ctx.lineTo(+12, -10);
            ctx.lineTo(+2, -7);
            ctx.stroke();
        
            //left eye
            ctx.beginPath();
            ctx.fillStyle = 'black';
            ctx.arc(-7, -3, 3, 0, Math.PI * 2);
            ctx.fill();
        
            //right eye
            ctx.beginPath();
            ctx.arc(+7, -3, 3, 0, Math.PI * 2);
            ctx.fill();
        
            // beard
            ctx.beginPath();
            ctx.strokeStyle = 'SaddleBrown';
            ctx.lineWidth = 4;
            ctx.lineTo(-12, +15);
            ctx.lineTo(-6, +7);
            ctx.lineTo(+6, +7);
            ctx.lineTo(+12, +15);
            ctx.stroke();
        
            ctx.beginPath();
            ctx.fillStyle = 'SaddleBrown';
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'white';
            ctx.lineTo(-5, +18);
            ctx.lineTo(+5, +18);
            ctx.lineTo(+0, +25);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
        
            //mouth
            ctx.beginPath();
            ctx.strokeStyle = 'black';
            ctx.arc(0, +16, 5, 200 * Math.PI / 180, 340 * Math.PI / 180);
            ctx.stroke();
        
            ctx.restore();
        }
    }

    //reset to original values.
    this.reset = function() {
        enemy.count = 1;
        enemy.x = [];
        enemy.y = [];
        enemy.enemyCoords();
    }
}

//calculates the distance from 2 objects and returns it.
function calculateDistance(x1, y1, x2, y2) {
	let distance = Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
	return distance;
}

//generates a random coordinates from 30 to 570 and returns it.
function randomCord() {
    let randomCordinate = Math.floor(Math.random() * 10) * 60 + 30;
    return randomCordinate;
}

//compares X and Y from player and trees, returning true if the same, false otherwise.
function checkTree(x, y) {
    for (let index = 0; index < game.treeX.length; index++) {
        if (x === game.treeX[index] && y === game.treeY[index]) {
            return true;
        }
    }
    return false;
}

//compares X and Y from enemy and other enemies, returning true if the same, false otherwise.
function checkEnemy(x, y) {
    for (let index = 0; index < enemy.x.length; index++) {
        if (x === enemy.x[index] && y === enemy.y[index]) {
            return true;
        }
    }
    return false;
}

//onkeydown function add moves to playerMoves array.
//updates the header.
function addMoves(e) {
    let key = e.key;

    if (!gameOver) {
        if (key == 'ArrowUp' && player.moves.length < 5) {
            player.moves.push(key);
    
            movesOutput.push('Up')
        } else if (key == 'ArrowDown' && player.moves.length < 5) {
            player.moves.push(key);
    
            movesOutput.push('Down');
        } else if (key == 'ArrowLeft' && player.moves.length < 5) {
            player.moves.push(key);
    
            movesOutput.push('Left');
        } else if (key == 'ArrowRight' && player.moves.length < 5) {
            player.moves.push(key);
    
            movesOutput.push('Right');
        } else if ((key == 't' || key == 'T') && player.moves.length < 5) {
            trapDown = true;
            player.moves.push(key);
    
            movesOutput.push('Trap');
        }
    
        movesHeader.innerHTML = 'Moves: ' + movesOutput;
    }
}

//onclick function, moves player updating x or y if conditions are met.
//updates the objective count, clear and re-draws all the components.
//set game over if player and enemy positions are the same.
function move() {
    let moveN = 60;

    if (!gameOver) {
        clearCanvas();

        game.drawGrid();
        game.drawTrees();

        if (player.moves[player.moveIndex] == 'ArrowUp' && (player.y - moveN) > 0 && !checkTree(player.x, player.y - moveN)) {
            player.y -= moveN;
        } else if (player.moves[player.moveIndex] == 'ArrowDown' && (player.y + moveN) < 600 && !checkTree(player.x, player.y + moveN)) {
            player.y += moveN;
        } else if (player.moves[player.moveIndex] == 'ArrowLeft' && (player.x - moveN) > 0 && !checkTree(player.x - moveN, player.y)) {
            player.x -= moveN;
        } else if (player.moves[player.moveIndex] == 'ArrowRight' && (player.x + moveN) < 600 && !checkTree(player.x + moveN, player.y)) {
            player.x += moveN;
        } else if ((player.moves[player.moveIndex] == 't' || player.moves[player.moveIndex] == 'T')) {
            player.trapX = player.x;
            player.trapY = player.y;
        }

        if (player.powerChance() && !powerDown) {
            powerDown = true;
            player.powerCoords();
        }

        if (player.x == player.powerX && player.y == player.powerY) {
            canMove = false;
            powerDown = false;
            player.powerMoves = 11;
            powerOn = true;
            player.powerX = player.powerFirstX;
            player.powerY = player.powerFirstY;
        }
    
        for (let index = 0; index < enemy.x.length; index++) {
            let randomOutcome = Math.floor(Math.random() * 4);
    
            if (player.moveIndex < 5 && canMove) {
                if (enemy.moves[randomOutcome] == 'ArrowUp' && (enemy.y[index] - moveN) > 0 && !checkTree(enemy.x[index], enemy.y[index] - moveN) && !checkEnemy(enemy.x[index], enemy.y[index] - moveN)) {
                    enemy.y[index] -= moveN;
                } else if (enemy.moves[randomOutcome] == 'ArrowDown' && (enemy.y[index] + moveN) < 600 && !checkTree(enemy.x[index], enemy.y[index] + moveN) && !checkEnemy(enemy.x[index], enemy.y[index] + moveN)) {
                    enemy.y[index] += moveN;
                } else if (enemy.moves[randomOutcome] == 'ArrowLeft' && (enemy.x[index] - moveN) > 0 && !checkTree(enemy.x[index] - moveN, enemy.y[index]) && !checkEnemy(enemy.x[index] - moveN, enemy.y[index])) {
                    enemy.x[index] -= moveN;
                } else if (enemy.moves[randomOutcome] == 'ArrowRight' && (enemy.x[index] + moveN) < 600 && !checkTree(enemy.x[index] + moveN, enemy.y[index]) && !checkEnemy(enemy.x[index] + moveN, enemy.y[index])) {
                    enemy.x[index] += moveN;
                }
            }

            if (enemy.x[index] == goal.x && enemy.y[index] == goal.y) {
                scoreCount -= 100;

                if (scoreCount < 0) {
                    scoreCount = 0;
                }
                scoreOutput.innerHTML = 'Score: ' + scoreCount;
        
                goal.objectiveCoords();
            } else if (enemy.x[index] == player.trapX && enemy.y[index] == player.trapY) {
                if (enemy.x[index] == player.x && enemy.y[index] == player.y) {
                    game.gameOver();
                } else {
                    scoreCount += 100;
                    scoreOutput.innerHTML = 'Score: ' + scoreCount;
        
                    trapDown = false;
    
                    player.trapX = -500;
                    player.trapY = -500;
    
                    enemy.x.splice(index, 1);
                    enemy.y.splice(index, 1);
                    index--;
    
                    enemy.enemyCoords();
                }
            }
            
            if (player.x == enemy.x[index] && player.y == enemy.y[index]) {
                game.gameOver();
            }
        }

        if (player.x == goal.x && player.y == goal.y) {
            scoreCount += 100;
            scoreOutput.innerHTML = 'Score: ' + scoreCount;
    
            goal.objectiveCoords();
        }
    
        if (scoreCount / 200 == enemy.count) {
            enemy.count++;
    
            enemy.enemyCoords();
        }


        if (!gameOver) {
            if (trapDown) {
                player.drawTrap();
            }

            if (powerDown) {
                player.drawSuperPower();
            }

            player.drawPlayer();
            goal.drawObjective();
            enemy.drawEnemies();
        }

        player.moveIndex++;

        if (powerOn) {
            player.powerMoves--;
        }

        powerMoves.innerHTML = 'Power Moves Left: ' + player.powerMoves;
    
        stopAnimation();
    }
}

//starts animation if conditions are met.
function startAnimation() {
    if (animation == -1 && player.moves.length == 5) {
        animation = setInterval(move, 500);
    }
}

//stops animation when global moveIndex reachs 5.
//reset player and header moves.
function stopAnimation() {
    if (player.moveIndex == 5) {
        player.moves = [];
        player.moveIndex = 0;

        movesOutput = [];
        movesHeader.innerHTML = 'Moves: ';
        
        clearInterval(animation);
        animation = -1;
    }

    if (player.powerMoves <= 0) {
        canMove = true;
        powerOn = false;
    }
}

//resets the game as anew.
function reset() {
    scoreCount = 0;
    scoreOutput.innerHTML = 'Score: ' + scoreCount;

    movesOutput = [];
    movesHeader.innerHTML = 'Moves: ';

    player.reset();

    powerMoves.innerHTML = 'Power Moves Left: ' + player.powerMoves;

    clearInterval(animation);
    animation = -1;
    
    clearCanvas();

    game.reset();

    enemy.reset();

    goal.objectiveCoords();

    gameOver = false;
    trapDown = false;
    powerDown = false;
    canMove = true;
    powerOn = false;

    game.drawTrees();
    goal.drawObjective();
    enemy.drawEnemies();
    player.drawPlayer();
}

function updateDate() {
    let date = new Date();
    let year = date.getFullYear();
    let footerP = document.getElementById('updateYear');
    footerP.innerHTML = `Copyright &copy ${year} Douglas Fantin`;
}