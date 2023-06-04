
class FireSquare
{
    LifeTime = 0.5;
    Timer = 0;
    CurrentFrame = 0;
    FramesNum = 4;
    constructor(Pos_X, Pos_Y, ExplosionGfx)
    {
        this.Pos_X = Pos_X;
        this.Pos_Y = Pos_Y;
        this.Timer = 0.0;
        this.ExplosionGfx = ExplosionGfx;
        this.Collision = new RectangleCollision(0, 0, 16*GameScale, 16*GameScale);
        this.Collision.SetParent(this);
    }

    SetParent(Parent)
    {
        this.Parent = Parent;
    }

    Update(DeltaTime)
    {
        this.Timer += DeltaTime;
        this.CurrentFrame = Math.floor(this.Timer/(this.LifeTime/this.FramesNum));

        if(this.CurrentFrame >= this.FramesNum)
        {
            this.Destroy();
        }
    }

    Draw()
    {
        this.ExplosionGfx.DrawFrame(this.Pos_X, this.Pos_Y, this.CurrentFrame);
        this.Collision.DebugDraw();
    }

    Destroy()
    {
    }
}

class Explosion
{
    LifeTime = 0.5;
    Timer = 0;
    CurrentFrame = 0;
    FramesNum = 4;
    FireObjects = [];
    constructor(Power)
    {
        let Scale = GameScale;
        let Sprite = new Image();
        Sprite.src = "DynablasteOnline.png";
        let FramesNum = 4;
        this.UpGfx = new StaticSprite(Sprite, 4, 167, 16, 16, FramesNum, 1, Scale);
        this.LeftGfx = new StaticSprite(Sprite, 76, 167, 16, 16, FramesNum, 1, Scale);
        this.DownGfx = new StaticSprite(Sprite, 148, 167, 16, 16, FramesNum, 1, Scale);
        this.RightGfx = new StaticSprite(Sprite, 220, 167, 16, 16, FramesNum, 1, Scale);
        this.HorizontalGfx = new StaticSprite(Sprite, 292, 167, 16, 16, FramesNum, 1, Scale);
        this.VerticalGfx = new StaticSprite(Sprite, 364, 167, 16, 16, FramesNum, 1, Scale);
        this.CenterGfx = new StaticSprite(Sprite, 436, 167, 16, 16, FramesNum, 1, Scale);
        this.Power = Power;
        this.Collision = new RectangleCollision(0, 0, 16*Scale, 16*Scale);
        this.Collision.SetParent(this);
    }

    SetParent(Parent)
    {
        this.Parent = Parent;
    }

    SetPos(Pos_X, Pos_Y)
    {
        this.Pos_X = Pos_X;
        this.Pos_Y = Pos_Y;
    }

    BeginPlay()
    {
        this.FireObjects.push(new FireSquare(this.Pos_X, this.Pos_Y, this.CenterGfx));

        let CenterPoint = this.Collision.GetCenterPoint();
        let TileCoord = Mapa.PixelToTile(CenterPoint.x, CenterPoint.y);

        let DrawX_Plus = true;
        let DrawX_Minus = true;
        let DrawY_Plus = true;
        let DrawY_Minus = true;

        for(let i = 1; i<this.Power; i++)
        {
            if(DrawY_Plus && !this.Parent.HasTileCollision(TileCoord.x, TileCoord.y+i))
                this.FireObjects.push(new FireSquare(this.Pos_X, this.Parent.TileToPixel(TileCoord.x, TileCoord.y+i).y, this.HorizontalGfx));
            else
                DrawY_Plus = false;

            if(DrawY_Minus && !this.Parent.HasTileCollision(TileCoord.x, TileCoord.y-i))
                this.FireObjects.push(new FireSquare(this.Pos_X, this.Parent.TileToPixel(TileCoord.x, TileCoord.y-i).y, this.HorizontalGfx));
            else
                DrawY_Minus = false;

            if(DrawX_Plus && !this.Parent.HasTileCollision(TileCoord.x+i, TileCoord.y))
                this.FireObjects.push(new FireSquare(this.Parent.TileToPixel(TileCoord.x+i, TileCoord.y).x, this.Pos_Y, this.VerticalGfx));
            else
                DrawX_Plus = false;

            if(DrawX_Minus && !this.Parent.HasTileCollision(TileCoord.x-i, TileCoord.y))
                this.FireObjects.push(new FireSquare(this.Parent.TileToPixel(TileCoord.x-i, TileCoord.y).x, this.Pos_Y, this.VerticalGfx));
            else
                DrawX_Minus = false;
        }

        if(DrawY_Minus && !this.Parent.HasTileCollision(TileCoord.x, TileCoord.y-this.Power))
            this.FireObjects.push(new FireSquare(this.Pos_X, this.Parent.TileToPixel(TileCoord.x, TileCoord.y-this.Power).y, this.UpGfx));

        if(DrawY_Plus && !this.Parent.HasTileCollision(TileCoord.x, TileCoord.y+this.Power))
            this.FireObjects.push(new FireSquare(this.Pos_X, this.Parent.TileToPixel(TileCoord.x, TileCoord.y+this.Power).y, this.DownGfx));

        if(DrawX_Minus && !this.Parent.HasTileCollision(TileCoord.x-this.Power, TileCoord.y))
            this.FireObjects.push(new FireSquare(this.Parent.TileToPixel(TileCoord.x-this.Power, TileCoord.y).x, this.Pos_Y, this.LeftGfx));

        if(DrawX_Plus && !this.Parent.HasTileCollision(TileCoord.x+this.Power, TileCoord.y))
            this.FireObjects.push(new FireSquare(this.Parent.TileToPixel(TileCoord.x+this.Power, TileCoord.y).x, this.Pos_Y, this.RightGfx));
    }

    Update(DeltaTime)
    {
        this.Timer += DeltaTime;
        this.CurrentFrame = Math.floor(this.Timer/(this.LifeTime/this.FramesNum));

        for (let i = 0; i < this.FireObjects.length; i++)
        {
            this.FireObjects[i].Update(DeltaTime);
        }

        if(this.CurrentFrame >= this.FramesNum)
        {
            this.Destroy();
        }
    }

    Draw()
    {
        for (let i = 0; i < this.FireObjects.length; i++)
        {
            this.FireObjects[i].Draw();
        }
    }

    Destroy()
    {
        this.Parent.RemoveObject(this);
    }
}