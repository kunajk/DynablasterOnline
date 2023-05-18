		
var width = window.innerWidth,
	height = window.innerHeight,
	ratio = window.devicePixelRatio;
	
var sprites = new Image();
sprites.src = "DynablasteOnline.png";

var canvas = document.getElementById("canvas"),
	context = canvas.getContext("2d");

canvas.width = width * ratio;
canvas.height = height * ratio;
canvas.style.width = width + "px";
canvas.style.height = height + "px";
context.scale(ratio, ratio);

// Informacja o aktualnie wcisnietych klawiszach
var PressedKeys={};
// Jesli klikniemy poza przegladarke kasujemy informacje o wcisnietych klawiszach
window.addEventListener('blur',()=>PressedKeys = {},false);
window.addEventListener('keydown', function(event) {
	event = event || window.event;
    PressedKeys[event.keyCode] = true;	
}, false);
window.addEventListener('keyup', function(event) {
	event = event || window.event;
    delete PressedKeys[event.keyCode];
}, false);

requestAnimationFrame(update);

class Player
{
	CurrentAnim;
	PlayerSpeed = 200.0;
	constructor(StartPosX, StartPosY, AnimationUp, AnimationLeft, AnimationDown, AnimationRight, AnimationIdle)
	{
		this.PlayerPosX = StartPosX;
		this.PlayerPosY = StartPosY;
		this.AnimationUp = AnimationUp;
		this.AnimationLeft = AnimationLeft;
		this.AnimationDown = AnimationDown;
		this.AnimationRight = AnimationRight;
		this.AnimationIdle = AnimationIdle;
		this.CurrentAnim = this.AnimationIdle;
	}

	SetKeys(Left, Right, Up, Down) {
		this.KEY_LEFT = Left;
		this.KEY_RIGHT = Right;
		this.KEY_UP = Up;
		this.KEY_DOWN = Down;
	}

	Draw()
	{
		this.CurrentAnim.Draw(this.PlayerPosX, this.PlayerPosY);
	}

	Update(DeltaTime)
	{
		this.CurrentAnim.Update(DeltaTime);

		if(PressedKeys[this.KEY_LEFT]) 
		{
			this.CurrentAnim = this.AnimationLeft;
			this.PlayerPosX -= this.PlayerSpeed*DeltaTime;
		} 
		else if(PressedKeys[this.KEY_RIGHT]) 
		{
			this.CurrentAnim = this.AnimationRight;
			this.PlayerPosX += this.PlayerSpeed*DeltaTime;
		} 
		else if(PressedKeys[this.KEY_UP]) 
		{
			this.CurrentAnim = this.AnimationUp;
			this.PlayerPosY -= this.PlayerSpeed*DeltaTime;
		} 
		else if(PressedKeys[this.KEY_DOWN]) 
		{
			this.CurrentAnim = this.AnimationDown;
			this.PlayerPosY += this.PlayerSpeed*DeltaTime;
		} 
		else 
		{
			this.CurrentAnim = this.AnimationIdle;
		}

		if(this.PlayerPosX > width-100)
			this.PlayerPosX = width-100;

		if(this.PlayerPosX < 0)
			this.PlayerPosX = 0;

		if(this.DistanceToMove_X < 0)
			this.DistanceToMove_X = 0;

		if(this.PlayerPosY > height-100)
			this.PlayerPosY = height-100;

		if(this.PlayerPosY < 0)
			this.PlayerPosY = 0;

		if(this.DistanceToMove_Y < 0)
			this.DistanceToMove_Y = 0;
	}
}

var AnimFPS = 7;

var P1_AnimationUp = new AnimatedSprite(sprites, AnimFPS, 0, 26, 22, 24, 3, 4.0);
var P1_AnimationLeft = new AnimatedSprite(sprites, AnimFPS, 0, 53, 22, 24, 3, 4.0);
var P1_AnimationDown = new AnimatedSprite(sprites, AnimFPS, 0, 80, 22, 24, 3, 4.0);
var P1_AnimationRight = new AnimatedSprite(sprites, AnimFPS, 0, 107, 22, 24, 3, 4.0);
var P1_AnimationIdle = new AnimatedSprite(sprites, 2.5, 0, 1, 22, 24, 3, 4.0);

var P2_AnimationUp = new AnimatedSprite(sprites, AnimFPS, 72, 26, 22, 24, 3, 4.0);
var P2_AnimationLeft = new AnimatedSprite(sprites, AnimFPS, 72, 53, 22, 24, 3, 4.0);
var P2_AnimationDown = new AnimatedSprite(sprites, AnimFPS, 72, 80, 22, 24, 3, 4.0);
var P2_AnimationRight = new AnimatedSprite(sprites, AnimFPS, 72, 107, 22, 24, 3, 4.0);
var P2_AnimationIdle = new AnimatedSprite(sprites, 3, 72, 1, 22, 24, 3, 4.0);

var Player_1 = new Player(150, 150, P1_AnimationUp, P1_AnimationLeft, P1_AnimationDown, P1_AnimationRight, P1_AnimationIdle);
var Player_2 = new Player(400, 400, P2_AnimationUp, P2_AnimationLeft, P2_AnimationDown, P2_AnimationRight, P2_AnimationIdle);

var Mapa = new	Level(19, 13);
Mapa.TworzMape();

let P1_KEY_LEFT = 37; // Strzalka w lewo
let P1_KEY_RIGHT = 39; // Strzalka w prawo
let P1_KEY_UP = 38; // Strzalka w gore
let P1_KEY_DOWN = 40; // Strzalka w dol
let P2_KEY_LEFT = 65; // Klawisz 'A'
let P2_KEY_RIGHT = 68; // Klawisz 'D'
let P2_KEY_UP = 87; // Klawisz 'W'
let P2_KEY_DOWN = 83; // Klawisz 'S'

Player_1.SetKeys(P1_KEY_LEFT, P1_KEY_RIGHT, P1_KEY_UP, P1_KEY_DOWN);
Player_2.SetKeys(P2_KEY_LEFT, P2_KEY_RIGHT, P2_KEY_UP, P2_KEY_DOWN);

function draw()
{
	context.clearRect(0, 0, width, height);
	context.font = "14px serif";
	context.fillText("Poruszanie postaci w stylu gry Dyna Blasters Bomberman - Janusz Kunowski", 10, 25);
	context.fillText("Player 1: sterowanie strzalkami", 10, 50);
	context.fillText("Player 2: sterowanie klawiszami W S A D", 10, 75);

	Mapa.Draw();
	Player_1.Draw();
	Player_2.Draw();
}



var lastUpdate = Date.now();
function update()
{
	var now = Date.now();
	var dt = (now - lastUpdate)/1000.0;
	lastUpdate = now;

	dt = Math.min(dt, 1.0);

	Player_1.Update(dt);
	Player_2.Update(dt);

	draw();
	requestAnimationFrame(update);
}


/* 

Zrezygnowalem z ponizszego kodu bo nie pozwalal mi na jednoczesne poruszanie sie dwoch graczy
Zamiast tego przechowuje informacje o aktualnie wcisnietych klawiszach w tablicy i dzieki 
temu moge sprawdzac jednoczesnie obu graczy

window.addEventListener('keydown', function(event) {
	switch (event.keyCode) {
		case 37: // Left
			Player_1.CurrentAnim = Player_1.AnimationLeft;
			Player_1.DistanceToMove_X += 30;
			Player_1.Direction_X = -1.0;
			break;

		case 38: // Up
			Player_1.CurrentAnim = Player_1.AnimationUp;
			Player_1.DistanceToMove_Y += 30;
			Player_1.Direction_Y = -1.0;
			break;

		case 39: // Right
			Player_1.CurrentAnim = Player_1.AnimationRight;
			Player_1.DistanceToMove_X += 30;
			Player_1.Direction_X = 1.0;
			break;

		case 40: // Down
			Player_1.CurrentAnim = Player_1.AnimationDown;
			Player_1.DistanceToMove_Y += 30;
			Player_1.Direction_Y = 1.0;
			break;

		case 68: //d (Player2 right)
			Player_2.CurrentAnim = Player_2.AnimationRight;
			Player_2.DistanceToMove_X += 30;
			Player_2.Direction_X = 1.0;
			break;
		case 83: //s (Player2 down)
			Player_2.CurrentAnim = Player_2.AnimationDown;
			Player_2.DistanceToMove_Y += 30;
			Player_2.Direction_Y = 1.0;
			break;
		case 65: //a (Player2 left)
			Player_2.CurrentAnim = Player_2.AnimationLeft;
			Player_2.DistanceToMove_X += 30;
			Player_2.Direction_X = -1.0;
			break;
		case 87: //w (Player2 up)
			Player_2.CurrentAnim = Player_2.AnimationUp;
			Player_2.DistanceToMove_Y += 30;
			Player_2.Direction_Y = -1.0;
			break;

	}
}, false); */