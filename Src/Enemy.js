
const MovementMode = {
    VERTICAL : 0,
    HORIZONTAL : 1
}
class Enemy
{
    constructor()
    {
        let Sprite = new Image();
        Sprite.src = "Gfx/DynablasteOnline.png";
        this.NormalAnimation = new AnimatedSprite(Sprite, 5, 3, 186, 16, 18, 3, 0, GameScale, true);
        this.DeadAnimation = new AnimatedSprite(Sprite, 3, 54, 186, 16, 18, 2, 1, GameScale, false);
        this.DeadAnimation.OnAnimationEnded = {Instance: this, Function: this.OnDestroyed};
        this.IsAlive = true;
        this.Collision = new RectangleCollision(0, 0, 16*GameScale, 16*GameScale, CollisionFlags.Overlap);
        this.Collision.SetParent(this);
        this.KolejnoscRysowania = KolejnoscRysowania.Postacie;
        this.Direction = 1;
        this.Mode = MovementMode.HORIZONTAL;
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

            let DistanceToMove = this.Direction*30.0*DeltaTime;

            if(this.Mode == MovementMode.HORIZONTAL)
            {
                let CollisionTest = new RectangleCollision(this.GetPosX() + DistanceToMove, this.GetPosY(), 16*GameScale, 16*GameScale);
                if(Mapa.HasCollisionWithRect(CollisionTest).CollidingObjects.length > 1)
                {
                    CollisionTest = new RectangleCollision(this.GetPosX() - DistanceToMove, this.GetPosY(), 16*GameScale, 16*GameScale);
                    if(Mapa.HasCollisionWithRect(CollisionTest).CollidingObjects.length > 1)
                        this.Mode = MovementMode.VERTICAL;
                    else
                    {
                        if(Math.random() * 100.0 < 50)
                            this.Mode = MovementMode.VERTICAL;
                        else
                        {
                            this.Direction *= -1;
                        }

                    }
                }
                else
                    this.Pos_X += DistanceToMove;
            }
            else
            {
                let CollisionTest = new RectangleCollision(this.GetPosX(), this.GetPosY() + DistanceToMove, 16*GameScale, 16*GameScale);
                if(Mapa.HasCollisionWithRect(CollisionTest).CollidingObjects.length > 1)
                {
                    CollisionTest = new RectangleCollision(this.GetPosX(), this.GetPosY() - DistanceToMove, 16*GameScale, 16*GameScale);
                    if(Mapa.HasCollisionWithRect(CollisionTest).CollidingObjects.length > 1)
                        this.Mode = MovementMode.HORIZONTAL;
                    else
                    {
                        if(Math.random() * 100.0 < 50)
                            this.Mode = MovementMode.HORIZONTAL;
                        else
                        {
                            this.Direction *= -1;
                        }
                    }

                }
                else
                    this.Pos_Y += DistanceToMove;
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

        this.Collision.DebugDraw();
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