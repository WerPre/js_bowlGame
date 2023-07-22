let level = 0;

function button_clicked(e){
    document.querySelectorAll('button').forEach(element => element.className = 'basic');
    document.getElementById(e).className = "clicked";
    level = parseInt(document.getElementById(e).value); //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
  };

function play(){
if (!level)
    alert("wybierz narpierw któryś poziom trudności.");
else{
document.querySelector('ul').remove();
document.getElementById('conteiner').style.display = "block";

const h3 = document.querySelector('h3');
const lifes = document.getElementById('lifes');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d'); //context
const width = canvas.width;
const height = canvas.height;

const bowl_image = {green: document.getElementById('green'), purple: document.getElementById('purple')};

const bowl = {image: bowl_image.green, x:(width-80)/2, y:height-50};

let left = false;
let right = false;

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Ball(x, y, vy, color) {
    this.x = x;
    this.y = y;
    this.vy = vy;
    this.color = color;
}


function ball_color() {
    if (getRandomIntInclusive(0, 1) == 0)
        return 'purple';
    else return 'green';
};

let score = 0;
/* function speed() {
    if (score < 100)
        return 3;
    else if (score < 400)
        return 4;
    else
        return 5;
} */

let balls = [];
function new_ball() {
  let ball = new Ball(
    20 + 40 * ((getRandomIntInclusive(1, 10)) - 1),//20 to promien kulki
    0,
    level,
    ball_color(),
  );

  balls.push(ball);
};

new_ball();

Ball.prototype.draw = function() {
    ctx.fillStyle = this.color;
	ctx.beginPath();
	ctx.arc(this.x, this.y, 20, 0, 2 * Math.PI);
	ctx.fill();
};

Ball.prototype.update = function(i) {
    if (this.y - 20 <= height) {
      this.y += this.vy;
    }
    else {
        lifes.removeChild(lifes.children[0]);
        balls.splice(i, 1);
    };

    if(this.y == 180)
        new_ball();

    if(this.x >= bowl.x && this.x <= bowl.x+bowl.width && this.y >= bowl.y){
        balls.splice(i, 1);

        if(this.color == bowl.color){
        score += 10;
        h3.textContent = score;
        }
        else
            lifes.removeChild(lifes.children[0]);
    };
 

};

bowl.draw = function() {
	ctx.drawImage(this.image, this.x, this.y);
};



//kontrolki z ścianami nie do przekroczenia
document.addEventListener('keydown', function(e){
	e.preventDefault();

	if(e.code == "ArrowLeft") 
        left = true;
	else if(e.code == "ArrowRight") 
        right = true;
});

document.addEventListener('keyup', function(e){
	e.preventDefault();

	if(e.code == "ArrowLeft") 
        left = false;
	else if(e.code == "ArrowRight") 
        right = false;
});

function move_bowl(){
    if (left && bowl.x > 0)
        bowl.x -= 11;
    if (right && bowl.x + bowl.width < 400)
        bowl.x += 11;
};

document.addEventListener('keydown', function(e){
    if(e.code == 'Space'){
	if(bowl.image == bowl_image.green)
        bowl.image = bowl_image.purple;
	else
        bowl.image = bowl_image.green;
    }
	e.preventDefault();
});

bowl.draw();

update();
function update() {
	// czyszczenie planszy
	ctx.clearRect(0,0, canvas.width, canvas.height);

    for (let i = 0; i < balls.length; i++) {
        balls[i].update(i);
        balls[i].draw();


    }

    move_bowl();
    bowl.draw();
    
    if (!lifes.children.length){
        alert("jeśli chcesz zagrać jeszcze raz odśwież stronę.");
        return;
    };

    window.requestAnimationFrame(update);
};
}
};