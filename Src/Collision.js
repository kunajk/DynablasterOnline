const CollisionFlags = {
    Block : 1,
    Overlap : 2
}

class RectangleCollision
{
    constructor(Pos_X, Pos_Y, Width, Height, Flags= CollisionFlags.Block)
    {
        this.Pos_X = Pos_X;
        this.Pos_Y = Pos_Y;
        this.Width = Width;
        this.Height = Height;
        this.CollisionFlags = Flags;
    }

	SetParent(Parent)
	{
		this.Parent = Parent;
        return this;
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

    DebugDraw()
    {
        if(!Debug.ShowCollisions)
            return;

        let Parent_X = (this.Parent) ? this.Parent.Pos_X : 0.0;
        let Parent_Y = (this.Parent) ? this.Parent.Pos_Y : 0.0;

        context.beginPath();
        context.fillStyle = "#FF000077";
        context.fillRect(this.Pos_X + Parent_X,  this.Pos_Y + Parent_Y, this.Width, this.Height);
        context.strokeStyle = "#FF0000";
        context.rect(this.Pos_X + Parent_X,  this.Pos_Y + Parent_Y, this.Width, this.Height);
        context.stroke();
    }

    HasCollisionWithRect(OtherRectCoision)
    {
        let pX = this.GetPosX();
        let pY = this.GetPosY();
        let oth_pX = OtherRectCoision.GetPosX();
        let oth_pY = OtherRectCoision.GetPosY();
        let VerySmallNumber = 0.00001;

        return (this.GetPosX()< OtherRectCoision.GetPosX() + OtherRectCoision.Width - VerySmallNumber &&
            this.GetPosX() + this.Width - VerySmallNumber > OtherRectCoision.GetPosX() &&
            this.GetPosY() < OtherRectCoision.GetPosY() + OtherRectCoision.Height - VerySmallNumber &&
            this.Height + this.GetPosY() - VerySmallNumber > OtherRectCoision.GetPosY());
    }


    GetNearestXOutsideCollision(PointX, PointY)
    {
        let Parent_X = (this.Parent) ? this.Parent.Pos_X : 0.0;
        let Parent_Y = (this.Parent) ? this.Parent.Pos_Y : 0.0;

        if(this.HasCollisionWithPoint(PointX, PointY))
        {
            let d1 = PointX - (this.Pos_X + Parent_X);
            let d2 = (this.Pos_X + Parent_X + this.Width) - PointX;

            if(d1 > d2)
            {
                return this.Pos_X + Parent_X + this.Width;
            }
            else
            {
                return this.Pos_X + Parent_X;
            }
        }
        else 
        {
            return PointX;
        }
    }

    GetNearestYOutsideCollision(PointX, PointY)
    {
        let Parent_X = (this.Parent) ? this.Parent.Pos_X : 0.0;
        let Parent_Y = (this.Parent) ? this.Parent.Pos_Y : 0.0;

        if(this.HasCollisionWithPoint(PointX, PointY))
        {
            let d1 = PointY - (this.Pos_Y + Parent_Y);
            let d2 = (this.Pos_Y + Parent_Y + this.Width) - PointY;

            if(d1 > d2)
            {
                return this.Pos_Y + Parent_Y + this.Height;
            }
            else
            {
                return this.Pos_Y + Parent_Y;
            }
        }
        else 
        {
            return PointY;
        }
    }

    HasCollisionWithPoint(PointX, PointY)
    {
        let Parent_X = (this.Parent) ? this.Parent.Pos_X : 0.0;
        let Parent_Y = (this.Parent) ? this.Parent.Pos_Y : 0.0;

        return (this.Pos_X + Parent_X < PointX &&
                this.Pos_X + Parent_X + this.Width > PointX &&
                this.Pos_Y + Parent_Y < PointY &&
                this.Height + this.Pos_Y + Parent_Y> PointY);
    }

    GetUpRightPoint()
    {
        let Parent_X = (this.Parent) ? this.Parent.Pos_X : 0.0;
        let Parent_Y = (this.Parent) ? this.Parent.Pos_Y : 0.0;
        return {x: Parent_X + this.Pos_X + this.Width, y: Parent_Y + this.Pos_Y};
    }

    GetUpLeftPoint()
    {
        let Parent_X = (this.Parent) ? this.Parent.Pos_X : 0.0;
        let Parent_Y = (this.Parent) ? this.Parent.Pos_Y : 0.0;
        return {x: Parent_X + this.Pos_X, y: Parent_Y + this.Pos_Y};
    }

    GetDownRightPoint()
    {
        let Parent_X = (this.Parent) ? this.Parent.Pos_X : 0.0;
        let Parent_Y = (this.Parent) ? this.Parent.Pos_Y : 0.0;
        return {x: Parent_X + this.Pos_X + this.Width, y: Parent_Y + this.Pos_Y + this.Height};
    }

    GetDownLeftPoint()
    {
        let Parent_X = (this.Parent) ? this.Parent.Pos_X : 0.0;
        let Parent_Y = (this.Parent) ? this.Parent.Pos_Y : 0.0;
        return {x: Parent_X + this.Pos_X, y: Parent_Y + this.Pos_Y + this.Height};
    }

    GetCenterPoint()
    {
        let Parent_X = (this.Parent) ? this.Parent.Pos_X : 0.0;
        let Parent_Y = (this.Parent) ? this.Parent.Pos_Y : 0.0;
        return {x: Parent_X + this.Pos_X + 0.5 * this.Width, y: Parent_Y + this.Pos_Y + 0.5 * this.Height};
    }
}