class Explosion
{
    LifeTime = 0.5;
    Timer = 0;
    CurrentFrame = 0;
    FramesNum = 4;
    constructor(Power)
    {
        let Scale = 4;
        let Sprite = new Image();
        Sprite.src = "DynablasteOnline.png";
        let FramesNum = 4;
        this.UpGfx = new StaticSprite(Sprite, 2, 167, 16, 16, FramesNum, 1, Scale);
        this.LeftGfx = new StaticSprite(Sprite, 72, 167, 16, 16, FramesNum, 1, Scale);
        this.DownGfx = new StaticSprite(Sprite, 144, 167, 16, 16, FramesNum, 1, Scale);
        this.RightGfx = new StaticSprite(Sprite, 216, 167, 16, 16, FramesNum, 1, Scale);
        this.HorizontalGfx = new StaticSprite(Sprite, 288, 167, 16, 16, FramesNum, 1, Scale);
        this.VerticalGfx = new StaticSprite(Sprite, 360, 167, 16, 16, FramesNum, 1, Scale);
        this.CenterGfx = new StaticSprite(Sprite, 432, 167, 16, 16, FramesNum, 1, Scale);
        this.Power = Power;
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
        let TileCoord = this.Parent.PixelToTile(this.Pos_X, this.Pos_Y);
        this.UpGfx.DrawFrame(this.Pos_X, this.Parent.TileToPixel(TileCoord.x, TileCoord.y-this.Power).y, this.CurrentFrame);
        this.DownGfx.DrawFrame(this.Pos_X, this.Parent.TileToPixel(TileCoord.x, TileCoord.y+this.Power).y, this.CurrentFrame);
        this.LeftGfx.DrawFrame(this.Parent.TileToPixel(TileCoord.x-this.Power, TileCoord.y).x, this.Pos_Y, this.CurrentFrame);
        this.RightGfx.DrawFrame(this.Parent.TileToPixel(TileCoord.x+this.Power, TileCoord.y).x, this.Pos_Y, this.CurrentFrame);
        this.CenterGfx.DrawFrame(this.Pos_X, this.Pos_Y, this.CurrentFrame);
        for(let i = 1; i<this.Power; i++)
        {
            this.HorizontalGfx.DrawFrame(this.Pos_X, this.Parent.TileToPixel(TileCoord.x, TileCoord.y+i).y, this.CurrentFrame);
            this.HorizontalGfx.DrawFrame(this.Pos_X, this.Parent.TileToPixel(TileCoord.x, TileCoord.y-i).y, this.CurrentFrame);
            this.VerticalGfx.DrawFrame(this.Parent.TileToPixel(TileCoord.x+i, TileCoord.y).x, this.Pos_Y, this.CurrentFrame);
            this.VerticalGfx.DrawFrame(this.Parent.TileToPixel(TileCoord.x-i, TileCoord.y).x, this.Pos_Y, this.CurrentFrame);
        }
    }

    Destroy()
    {
        this.Parent.RemoveObject(this);
    }
}