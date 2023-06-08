//import { Explosion } from "./Explosion.js";
class Bomb
{
    LifeTime = 3.0;

    constructor(Power)
    {
        let Scale = GameScale;
        let Sprite = new Image();
		Sprite.src = "DynablasteOnline.png";
        this.Animation = new AnimatedSprite(Sprite, 4, 2, 149, 16, 16, 3, 1, Scale);
        this.Power = Power;
        this.Collision = new RectangleCollision(0, 0, 16*Scale, 16*Scale);
        this.Collision.SetParent(this);
    }

    SetPos(Pos_X, Pos_Y)
    {
        this.Pos_X = Pos_X;
        this.Pos_Y = Pos_Y;
    }

    SetParent(Parent)
    {
        this.Parent = Parent;
    }

    GetPosX()
    {
        let Parent_X = (this.Parent) ? this.Parent.GetPosX() : 0.0;
        return this.Pos_X + Parent_X;
    }

    GetPosY()
    {
        let Parent_Y = (this.Parent) ? this.Parent.GetPosY() : 0.0;
        return this.Pos_Y + Parent_Y;
    }

    BeginPlay()
    {

    }

    Update(DeltaTime)
    {
        this.Animation.Update(DeltaTime);

        this.LifeTime -= DeltaTime;

        if(this.LifeTime <= 0.0)
        {
            this.Destroy();
        }
    }

    Draw()
    {
        this.Animation.Draw(this.Pos_X, this.Pos_Y);
        this.Collision.DebugDraw();
    }

    Destroy()
    {
        let CenterPoint = this.Collision.GetCenterPoint();
        let TileCoord = Mapa.PixelToTile(CenterPoint.x, CenterPoint.y);
        this.Parent.AddActor(TileCoord.x, TileCoord.y, new Explosion(this.Power));
        this.Parent.RemoveObject(this);
    }
}