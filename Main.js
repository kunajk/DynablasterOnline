		
var width = window.innerWidth,
	height = window.innerHeight,
	ratio = window.devicePixelRatio;

var FPS = 0;

var Debug = {
	ShowCollisions: false,
	ShowFPS: false
}

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

	switch (event.keyCode) {
		case 67: // 'C' Toggle show debug collisions
			Debug.ShowCollisions = !Debug.ShowCollisions;
			break;
		case 70: // 'C' Toggle showFPS
			Debug.ShowFPS = !Debug.ShowFPS;
			break;
	}

	Player_1.OnKeyUp(event.keyCode);
	Player_2.OnKeyUp(event.keyCode);
}, false);

requestAnimationFrame(update);

class Player
{
	CurrentAnim;
	PlayerSpeed = 200.0;
	constructor(StartPos_X, StartPos_Y, AnimationUp, AnimationLeft, AnimationDown, AnimationRight, AnimationIdle)
	{
		this.Pos_X = StartPos_X;
		this.Pos_Y = StartPos_Y;
		this.AnimationUp = AnimationUp;
		this.AnimationLeft = AnimationLeft;
		this.AnimationDown = AnimationDown;
		this.AnimationRight = AnimationRight;
		this.AnimationIdle = AnimationIdle;
		this.CurrentAnim = this.AnimationIdle;

		let Scale = 4.0;
		this.Collision = new RectangleCollision(Scale*4, Scale*16, Scale*15, Scale*6).SetParent(this);
	}

	SetKeys(Left, Right, Up, Down, Bomb)
	{
		this.KEY_LEFT = Left;
		this.KEY_RIGHT = Right;
		this.KEY_UP = Up;
		this.KEY_DOWN = Down;
		this.KEY_BOMB = Bomb;
	}

	Draw()
	{
		this.CurrentAnim.Draw(this.Pos_X, this.Pos_Y);

		this.Collision.DebugDraw();
	}

	Update(DeltaTime)
	{
		this.CurrentAnim.Update(DeltaTime);
		let DistanceToMove = this.PlayerSpeed*DeltaTime;

		if(PressedKeys[this.KEY_LEFT]) 
		{
			this.CurrentAnim = this.AnimationLeft;
			
			let UpPoint = this.Collision.GetUpLeftPoint();
			let DownPoint = this.Collision.GetDownLeftPoint();
			let CenterPoint = {x: UpPoint.x, y:(UpPoint.y + DownPoint.y)/2.0};

			let IsUpPointCollision = Mapa.HasCollisionWithPoint(UpPoint.x - this.PlayerSpeed*DeltaTime, UpPoint.y);
			let IsDownPointCollision = Mapa.HasCollisionWithPoint(DownPoint.x - this.PlayerSpeed*DeltaTime, DownPoint.y);
			let IsCenterPointCollision = Mapa.HasCollisionWithPoint(CenterPoint.x - DistanceToMove, CenterPoint.y);

			let PrevDistanceToMove = DistanceToMove;

			if(IsUpPointCollision)
			{
				DistanceToMove = Math.abs(UpPoint.x - Mapa.GetNearestXOutsideCollision(UpPoint.x - DistanceToMove, UpPoint.y));
			}
			else if(IsDownPointCollision)
			{
				DistanceToMove = Math.abs(DownPoint.x - Mapa.GetNearestXOutsideCollision(DownPoint.x - DistanceToMove, DownPoint.y));
			}

			if(IsUpPointCollision && !IsCenterPointCollision)
			{
				this.Pos_Y += (PrevDistanceToMove - DistanceToMove)
			}
			else if(IsDownPointCollision && !IsCenterPointCollision)
			{
				this.Pos_Y -= (PrevDistanceToMove - DistanceToMove)
			}

			this.Pos_X -= DistanceToMove;
		} 
		else if(PressedKeys[this.KEY_RIGHT]) 
		{
			this.CurrentAnim = this.AnimationRight;

			let UpPoint = this.Collision.GetUpRightPoint();
			let DownPoint = this.Collision.GetDownRightPoint();
			let CenterPoint = {x: UpPoint.x, y:(UpPoint.y + DownPoint.y)/2.0};

			let IsUpPointCollision = Mapa.HasCollisionWithPoint(UpPoint.x + this.PlayerSpeed*DeltaTime, UpPoint.y);
			let IsDownPointCollision = Mapa.HasCollisionWithPoint(DownPoint.x + this.PlayerSpeed*DeltaTime, DownPoint.y);
			let IsCenterPointCollision = Mapa.HasCollisionWithPoint(CenterPoint.x + DistanceToMove, CenterPoint.y);

			let PrevDistanceToMove = DistanceToMove;

			if(IsUpPointCollision)
			{
				DistanceToMove = Math.abs(UpPoint.x - Mapa.GetNearestXOutsideCollision(UpPoint.x + DistanceToMove, UpPoint.y));
			}
			else if(IsDownPointCollision)
			{
				DistanceToMove = Math.abs(DownPoint.x - Mapa.GetNearestXOutsideCollision(DownPoint.x + DistanceToMove, DownPoint.y));
			}

			if(IsUpPointCollision && !IsCenterPointCollision)
			{
				this.Pos_Y += (PrevDistanceToMove - DistanceToMove)
			}
			else if(IsDownPointCollision && !IsCenterPointCollision)
			{
				this.Pos_Y -= (PrevDistanceToMove - DistanceToMove)
			}

			this.Pos_X += DistanceToMove;
		} 
		else if(PressedKeys[this.KEY_UP]) 
		{
			this.CurrentAnim = this.AnimationUp;

			let RightPoint = this.Collision.GetUpRightPoint();
			let LeftPoint = this.Collision.GetUpLeftPoint();
			let CenterPoint = {x: (RightPoint.x + LeftPoint.x)/2.0, y: RightPoint.y};

			let IsRightPointCollision = Mapa.HasCollisionWithPoint(RightPoint.x, RightPoint.y - DistanceToMove);
			let IsLeftPointCollision = Mapa.HasCollisionWithPoint(LeftPoint.x, LeftPoint.y - DistanceToMove);
			let IsCenterPointCollision = Mapa.HasCollisionWithPoint(CenterPoint.x, CenterPoint.y - DistanceToMove);

			let PrevDistanceToMove = DistanceToMove;

			if(IsRightPointCollision)
			{
				DistanceToMove = Math.abs(RightPoint.y - Mapa.GetNearestYOutsideCollision(RightPoint.x, RightPoint.y - DistanceToMove));
			}
			else if(IsLeftPointCollision)
			{
				DistanceToMove = Math.abs(LeftPoint.y - Mapa.GetNearestYOutsideCollision(LeftPoint.x, LeftPoint.y - DistanceToMove));
			}

			if(IsRightPointCollision && !IsCenterPointCollision)
			{
				this.Pos_X -= (PrevDistanceToMove - DistanceToMove)
			}
			else if(IsLeftPointCollision && !IsCenterPointCollision)
			{
				this.Pos_X += (PrevDistanceToMove - DistanceToMove)
			}

			this.Pos_Y -= DistanceToMove;
		} 
		else if(PressedKeys[this.KEY_DOWN]) 
		{
			this.CurrentAnim = this.AnimationDown;

			let RightPoint = this.Collision.GetDownRightPoint();
			let LeftPoint = this.Collision.GetDownLeftPoint();
			let CenterPoint = {x: (RightPoint.x + LeftPoint.x)/2.0, y: RightPoint.y};

			let IsRightPointCollision = Mapa.HasCollisionWithPoint(RightPoint.x, RightPoint.y + DistanceToMove);
			let IsLeftPointCollision = Mapa.HasCollisionWithPoint(LeftPoint.x, LeftPoint.y + DistanceToMove);
			let IsCenterPointCollision = Mapa.HasCollisionWithPoint(CenterPoint.x, CenterPoint.y + DistanceToMove);

			let PrevDistanceToMove = DistanceToMove;

			if(IsRightPointCollision)
			{
				DistanceToMove = Math.abs(RightPoint.y - Mapa.GetNearestYOutsideCollision(RightPoint.x, RightPoint.y + DistanceToMove));
			}
			else if(IsLeftPointCollision)
			{
				DistanceToMove = Math.abs(LeftPoint.y - Mapa.GetNearestYOutsideCollision(LeftPoint.x, LeftPoint.y + DistanceToMove));
			}

			if(IsRightPointCollision && !IsCenterPointCollision)
			{
				this.Pos_X -= (PrevDistanceToMove - DistanceToMove)
			}
			else if(IsLeftPointCollision && !IsCenterPointCollision)
			{
				this.Pos_X += (PrevDistanceToMove - DistanceToMove)
			}

			this.Pos_Y += DistanceToMove;
		} 
		else 
		{
			this.CurrentAnim = this.AnimationIdle;
		}

		if(PressedKeys[this.KEY_BOMB])
		{

		}
	}

	OnKeyUp(KeyCode)
	{
		switch (KeyCode)
		{
			case this.KEY_BOMB:
				let CenterPoint = this.Collision.GetCenterPoint();
				Mapa.SpawnBomb(CenterPoint.x, CenterPoint.y, 1);
				break;
		}
	}
}

var AnimFPS = 7;

var P1_AnimationUp = new AnimatedSprite(sprites, AnimFPS, 0, 26, 24, 22, 3, 0, 4.0);
var P1_AnimationLeft = new AnimatedSprite(sprites, AnimFPS, 0, 53, 24, 22, 3, 0, 4.0);
var P1_AnimationDown = new AnimatedSprite(sprites, AnimFPS, 0, 80, 24, 22, 3, 0, 4.0);
var P1_AnimationRight = new AnimatedSprite(sprites, AnimFPS, 0, 107, 24, 22, 3, 0, 4.0);
var P1_AnimationIdle = new AnimatedSprite(sprites, 2.5, 0, 1, 24, 22, 3, 0, 4.0);

var P2_AnimationUp = new AnimatedSprite(sprites, AnimFPS, 72, 26, 24, 22, 3, 0, 4.0);
var P2_AnimationLeft = new AnimatedSprite(sprites, AnimFPS, 72, 53, 24, 22, 3, 0, 4.0);
var P2_AnimationDown = new AnimatedSprite(sprites, AnimFPS, 72, 80, 24, 22, 3, 0, 4.0);
var P2_AnimationRight = new AnimatedSprite(sprites, AnimFPS, 72, 107, 24, 22, 3, 0, 4.0);
var P2_AnimationIdle = new AnimatedSprite(sprites, 3, 72, 1, 24, 22, 3, 0, 4.0);

var Player_1 = new Player(150, 150, P1_AnimationUp, P1_AnimationLeft, P1_AnimationDown, P1_AnimationRight, P1_AnimationIdle);
var Player_2 = new Player(400, 400, P2_AnimationUp, P2_AnimationLeft, P2_AnimationDown, P2_AnimationRight, P2_AnimationIdle);

var Mapa = new	Level(19, 13);
Mapa.TworzMape();

let P1_KEY_LEFT = 37; // Strzalka w lewo
let P1_KEY_RIGHT = 39; // Strzalka w prawo
let P1_KEY_UP = 38; // Strzalka w gore
let P1_KEY_DOWN = 40; // Strzalka w dol
let P1_KEY_BOMB = 32 // Spacja
let P2_KEY_LEFT = 65; // Klawisz 'A'
let P2_KEY_RIGHT = 68; // Klawisz 'D'
let P2_KEY_UP = 87; // Klawisz 'W'
let P2_KEY_DOWN = 83; // Klawisz 'S'
let P2_KEY_BOMB = 96; // Numpad 0

Player_1.SetKeys(P1_KEY_LEFT, P1_KEY_RIGHT, P1_KEY_UP, P1_KEY_DOWN, P1_KEY_BOMB);
Player_2.SetKeys(P2_KEY_LEFT, P2_KEY_RIGHT, P2_KEY_UP, P2_KEY_DOWN, P2_KEY_BOMB);

function draw()
{
	context.clearRect(0, 0, width, height);

	Mapa.Draw();
	Player_1.Draw();
	Player_2.Draw();

	if(Debug.ShowFPS)
	{
		context.beginPath();
		context.font = "bold 12pt Courier";
		context.strokeStyle = 'black';
		context.lineWidth = 3;
		context.strokeText("FPS: " + FPS, width - 70, 15);
		context.fillStyle = 'white';
		context.fillText("FPS: " + FPS, width - 70, 15);
	}

	context.beginPath();
	context.font = "8pt serif";
	context.rect(190, 5, 500, 40);
	context.fillStyle = "#FFFFFF"
	context.fill();
	context.fillStyle = "#000000"
	context.fillText("Player 1: sterowanie strzalkami", 200, 15);
	context.fillText("Player 2: sterowanie klawiszami W S A D", 200, 30);
	context.fillStyle = "#440303"
	context.fillText("C - Show collisions", 400, 15);
	context.fillText("F - Show FPS", 400, 30);
}



var lastUpdate = Date.now();
function update()
{
	var now = Date.now();
	var dt = (now - lastUpdate)/1000.0;
	lastUpdate = now;
	FPS = Math.round((1000 - dt) * (60 / 1000));

	dt = Math.min(dt, 1.0);

	Player_1.Update(dt);
	Player_2.Update(dt);
	Mapa.Update(dt);

	draw();
	requestAnimationFrame(update);
}

