class Enemy
{
    constructor()
    {
        let Sprite = new Image();
        Sprite.src = "DynablasteOnline.png";
        this.NormalAnimation = new AnimatedSprite(Sprite, 5, 3, 186, 16, 18, 3, 0, GameScale, true);
        this.DeadAnimation = new AnimatedSprite(Sprite, 3, 54, 186, 16, 18, 2, 1, GameScale, false);
        this.DeadAnimation.OnAnimationEnded = {Instance: this, Function: this.OnDestroyed};
        this.IsAlive = true;
        this.Collision = new RectangleCollision(0, 0, 16*GameScale, 16*GameScale, CollisionFlags.Overlap);
        this.Collision.SetParent(this);
        this.KolejnoscRysowania = KolejnoscRysowania.Postacie;
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

    SetParent(Parent)
    {
        this.Parent = Parent;
    }

    BeginPlay()
    {

    }
    Update(DeltaTime)
    {
        if(this.IsAlive)
        {
            let ObjectsToDestroy = Mapa.GetCollidingObjects(this.Collision);
            for(let obj of  ObjectsToDestroy)
            {
                if(obj != this.Parent && obj != this)
                    obj.Destroy();
            }

            this.NormalAnimation.Update(DeltaTime);
        }
        else
        {
            this.DeadAnimation.Update(DeltaTime);
        }
    }

    Draw()
    {
        let OffsetY = 9;
        if(this.IsAlive)
        {
            this.NormalAnimation.Draw(this.Pos_X, this.Pos_Y-OffsetY);
        }
        else
        {
            this.DeadAnimation.Draw(this.Pos_X, this.Pos_Y-OffsetY);
        }
    }

    Destroy()
    {
        this.IsAlive = false;
    }
    OnDestroyed()
    {
        Mapa.RemoveObject(this);
    }
}