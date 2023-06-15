const PowerUpType = {
    BombPower : 0,
    BombCount : 1,
    Frame : 2
}
class PowerUp
{
    constructor(Type)
    {
        let Sprite = new Image();
        Sprite.src = "Gfx/DynablasteOnline.png";
        this.PowerUpGfx = new StaticSprite(Sprite, 184, 149, 16, 16, 3, 0,  GameScale);
        this.Collision = new RectangleCollision(0, 0, 16*GameScale, 16*GameScale, CollisionFlags.Overlap);
        this.Collision.SetParent(this);
        this.KolejnoscRysowania = KolejnoscRysowania.PowerUpy;
        this.Type = Type;
        this.IsFrameVisible = false;
        this.Timer = 0.0;
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
        let CollidingObjects = Mapa.GetCollidingObjects(this.Collision);
        for (let object of CollidingObjects)
        {
            if(object instanceof Player)
            {
                var SfxPowerUp = new Audio('Sfx/powerup.mp3');
                SfxPowerUp.play();

                this.ApplyPowerUp(object);
                Mapa.RemoveObject(this);
            }
        }

        this.Timer += DeltaTime;
        if(this.Timer >= 0.5)
        {
            this.Timer = 0.0;
            this.IsFrameVisible = !this.IsFrameVisible;
        }
    }

    Draw()
    {
        this.PowerUpGfx.DrawFrame(this.Pos_X, this.Pos_Y, this.Type);

        if(this.IsFrameVisible)
            this.PowerUpGfx.DrawFrame(this.Pos_X, this.Pos_Y, PowerUpType.Frame);
    }

    ApplyPowerUp(Player)
    {
        switch (this.Type)
        {
            case PowerUpType.BombPower:
            {
                Player.BombPower++;
                break;
            }
            case PowerUpType.BombCount:
            {
                Player.MaxBombCount++;
                break;
            }
        }
    }

    Destroy()
    {

    }
}