
const BrickState = {
    NORMAL : 0,
    DESTROYING : 1
}
class Brick
{
    constructor()
    {
        let Scale = GameScale;
        let Sprite = new Image();
        Sprite.src = "DynablasteOnline.png";
        this.BrickGfx = new StaticSprite(Sprite, 38, 131, 16, 16, 1, 0, Scale);
        this.DestroyedGfx = new AnimatedSprite(Sprite, 7, 56, 149, 16, 16, 6, 2, Scale, false);
        this.DestroyedGfx.OnAnimationEnded = {Instance: this, Function: this.OnDestroyed};
        this.Collision = new RectangleCollision(0, 0, 16*Scale, 16*Scale);
        this.Collision.SetParent(this);
        this.State = BrickState.NORMAL;
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
        if(this.State == BrickState.DESTROYING)
        {
            this.DestroyedGfx.Update(DeltaTime);
        }
    }

    Draw()
    {
        if(this.State == BrickState.NORMAL)
            this.BrickGfx.DrawFrame(this.Pos_X, this.Pos_Y, 0);
        else
            this.DestroyedGfx.Draw(this.Pos_X, this.Pos_Y);

        this.Collision.DebugDraw();
    }
    Destroy()
    {
        this.State = BrickState.DESTROYING;
    }
    OnDestroyed()
    {
        Mapa.RemoveObject(this);
    }
}