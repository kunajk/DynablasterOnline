
class FireSquare
{
    Timer = 0;
    CurrentFrame = 0;
    FramesNum = 4;
    constructor(Pos_X, Pos_Y, ExplosionGfx, LifeTime)
    {
        this.Pos_X = Pos_X;
        this.Pos_Y = Pos_Y;
        this.Timer = 0.0;
        this.ExplosionGfx = ExplosionGfx;
        this.Collision = new RectangleCollision(0, 0, 16*GameScale, 16*GameScale);
        this.Collision.SetParent(this);
        this.IsVisible = true;
        this.LifeTime = LifeTime;
        this.KolejnoscRysowania = KolejnoscRysowania.BombyEksplozje;
    }

    SetParent(Parent)
    {
        this.Parent = Parent;
    }

    GetPosX()
    {
        return this.Pos_X;
    }

    GetPosY()
    {
        return this.Pos_Y;
    }

    Update(DeltaTime)
    {
        this.Timer += DeltaTime;
        this.CurrentFrame = Math.floor(this.Timer/(this.LifeTime/this.FramesNum));

        if(this.CurrentFrame >= this.FramesNum)
        {
            this.CurrentFrame = 0;
            this.Destroy();
        }

        let ObjectsToDestroy = Mapa.GetCollidingObjects(this.Collision);
        for(let obj of  ObjectsToDestroy)
        {
            if(obj != this.Parent && obj != this)
                obj.Destroy();
        }
    }

    Draw()
    {
        if(this.IsVisible)
        {
            this.ExplosionGfx.DrawFrame(this.Pos_X, this.Pos_Y, this.CurrentFrame);
            this.Collision.DebugDraw();
        }
    }

    Destroy()
    {
        this.IsVisible = false;
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
        Sprite.src = "Gfx/DynablasteOnline.png";
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
        this.KolejnoscRysowania = KolejnoscRysowania.BombyEksplozje;
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

    BeginPlay_SpawnExplosionOrDestroyObject(Tile_X, Tile_Y, IsHorizontal, IsLast, IsUpOrLeft)
    {
        let CollisionTest =  this.Parent.HasTileCollision(Tile_X, Tile_Y);

        if(!CollisionTest.HasCollision)
        {
            if(IsLast)
            {
                if(IsUpOrLeft)
                {
                    if(IsHorizontal)
                    {
                        this.FireObjects.push(new FireSquare(this.Pos_X, this.Parent.TileToPixel(Tile_X, Tile_Y).y, this.UpGfx, this.LifeTime));
                    }
                    else
                    {
                        this.FireObjects.push(new FireSquare(this.Parent.TileToPixel(Tile_X, Tile_Y).x, this.Pos_Y, this.LeftGfx, this.LifeTime));
                    }
                }
                else
                {
                    if(IsHorizontal)
                    {
                        this.FireObjects.push(new FireSquare(this.Pos_X, this.Parent.TileToPixel(Tile_X, Tile_Y).y, this.DownGfx, this.LifeTime));
                    }
                    else
                    {
                        this.FireObjects.push(new FireSquare(this.Parent.TileToPixel(Tile_X, Tile_Y).x, this.Pos_Y, this.RightGfx, this.LifeTime));
                    }
                }
            }
            else
            {
                if(IsHorizontal)
                    this.FireObjects.push(new FireSquare(this.Pos_X, this.Parent.TileToPixel(Tile_X, Tile_Y).y, this.HorizontalGfx, this.LifeTime));
                else
                    this.FireObjects.push(new FireSquare(this.Parent.TileToPixel(Tile_X, Tile_Y).x, this.Pos_Y, this.VerticalGfx, this.LifeTime));
            }
        }
        else
        {
            for(let objToDestroy of CollisionTest.CollidingObjects)
            {
                objToDestroy.Destroy();
            }

            return {HasCollision: true};
        }

        return {HasCollision: false};
    }
    BeginPlay()
    {
        var SfxBomb = new Audio('Sfx/shot.wav');
        SfxBomb.play();

        this.FireObjects.push(new FireSquare(this.Pos_X, this.Pos_Y, this.CenterGfx, this.LifeTime));

        let CenterPoint = this.Collision.GetCenterPoint();
        let TileCoord = Mapa.PixelToTile(CenterPoint.x, CenterPoint.y);

        for(let i = 1; i <= this.Power; i++)
        {
            let Result = this.BeginPlay_SpawnExplosionOrDestroyObject(TileCoord.x, TileCoord.y+i, true, i==this.Power, false);
            if(Result.HasCollision)
            {
                break;
            }

        }

        for(let i = 1; i <= this.Power; i++)
        {
            let Result = this.BeginPlay_SpawnExplosionOrDestroyObject(TileCoord.x, TileCoord.y-i, true, i==this.Power, true);
            if(Result.HasCollision)
                break;
        }

        for(let i = 1; i <= this.Power; i++)
        {
            let Result = this.BeginPlay_SpawnExplosionOrDestroyObject(TileCoord.x+i, TileCoord.y, false, i==this.Power, false);
            if(Result.HasCollision)
                break;
        }

        for(let i = 1; i <= this.Power; i++)
        {
            let Result = this.BeginPlay_SpawnExplosionOrDestroyObject(TileCoord.x-i, TileCoord.y, false, i==this.Power, true);
            if(Result.HasCollision)
                break;
        }

        for (let i = 0; i < this.FireObjects.length; i++)
        {
            this.FireObjects[i].SetParent(this);
        }
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