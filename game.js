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

        // Load bowl images
        const bowlImagePurple = new Image();
        bowlImagePurple.src = 'bowl_purple.svg';

        const bowlImageGreen = new Image();
        bowlImageGreen.src = 'bowl_green.svg';

        // New Bowl constructor function
        function Bowl() {
            this.x = width / 2;
            this.y = height - 20;
            this.width = 80;
            this.image = bowlImagePurple;
            this.color = 'purple'
        }

        Bowl.prototype.draw = function() {
            // Draw the bowl image
            ctx.drawImage(this.image, this.x - 40, this.y - 30, 80, 60);
        };

        const bowl = new Bowl();

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
        }

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

            if(this.x >= bowl.x-35 && this.x <= bowl.x+bowl.width+35 && this.y >= bowl.y){
                balls.splice(i, 1);

                if(this.color == bowl.color){
                score += 10;
                h3.textContent = score;
                }
                else
                    lifes.removeChild(lifes.children[0]);
            };
        

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
            if (left && bowl.x-40 > 0)
                bowl.x -= 8;
            if (right && bowl.x + bowl.width < width + 40)
                bowl.x += 8;
        };

        document.addEventListener('keydown', function(e){
            if(e.code == 'Space'){
        	    if(bowl.color == 'green'){            
                    bowl.image = bowlImagePurple;
                    bowl.color = 'purple';
                }
        	    else{
                    bowl.image = bowlImageGreen;
                    bowl.color = 'green';
                }
            }
        	e.preventDefault();
        });

        bowl.draw();

        update();
        function update() {
        	// czyszczenie planszy
        	ctx.clearRect(0,0, canvas.width, canvas.height);

            for (let i = 0; i < balls.length; i++) {
                balls[i].draw();
                balls[i].update(i);
            }

            move_bowl();
            bowl.draw();

            if (!lifes.children.length){
                alert("if you want to play once again, refresh website");
                return;
            };

            window.requestAnimationFrame(update);
        };
    }
};
