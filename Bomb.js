
class Bomb
{
    LifeTime = 3.0;

    constructor(Pos_X, Pos_Y, Power)
    {
        this.Pos_X = Pos_X;
        this.Pos_Y = Pos_Y;
        let Sprite = new Image();
		Sprite.src = "DynablasteOnline.png";
        this.Animation = new AnimatedSprite(Sprite, 4, 2, 149, 16, 16, 3, 1, 4.0);;
        this.Power = Power;
        this.Collision = new RectangleCollision(Pos_X, Pos_Y, 16, 16);
    }

    SetParent(Parent)
    {
        this.Parent = Parent;
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
    }

    Destroy()
    {
        this.Parent.RemoveObject(this);
    }
}