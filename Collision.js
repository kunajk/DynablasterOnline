class RectangleCollision
{
    constructor(Pos_X, Pos_Y, Width, Height)
    {
        this.Pos_X = Pos_X;
        this.Pos_Y = Pos_Y;
        this.Width = Width;
        this.Height = Height;
    }

    HasCollisionWithRect(OtherRectCoision)
    {
        return (this.Pos_X < OtherRectCoision.Pos_X + OtherRectCoision.Width &&
                this.Pos_X + this.Width > OtherRectCoision.Pos_X &&
                this.Pos_Y < OtherRectCoision.Pos_Y + OtherRectCoision.Height &&
                this.Height + this.Pos_Y > OtherRectCoision.Pos_Y);
    }

    HasCollisionWithPoint(PointX, PointY)
    {
        return (this.Pos_X < PointX &&
                this.Pos_X + this.Width > PointX &&
                this.Pos_Y < PointY &&
                this.Height + this.Pos_Y > PointY);
    }
}