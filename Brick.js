
class Brick
{
    constructor()
    {
        let Scale = GameScale;
        let Sprite = new Image();
        Sprite.src = "DynablasteOnline.png";
        this.BrickGfx = new StaticSprite(Sprite, 38, 131, 16, 16, 1, 0, Scale);
        this.DestroyedGfx = new StaticSprite(Sprite, 56, 149, 16, 16, 7, 2, Scale);
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

    BeginPlay()
    {

    }

    Update(DeltaTime)
    {/*
        this.Animation.Update(DeltaTime);

        this.LifeTime -= DeltaTime;

        if(this.LifeTime <= 0.0)
        {
            this.Destroy();
        }*/
    }

    Draw()
    {
        this.BrickGfx.DrawFrame(this.Pos_X, this.Pos_Y, 0);
        this.Collision.DebugDraw();
    }

    Destroy()
    {
        let TileCoord =  this.Parent.PixelToTile(this.Pos_X, this.Pos_Y);
        this.Parent.AddActor(TileCoord.x, TileCoord.y, new Explosion(this.Power));
        this.Parent.RemoveObject(this);
    }
}