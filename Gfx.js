
class StaticSprite
{
    currentFrame = 0;
    constructor(sprite, startPosX, startPosY, height, width, framesNum, margin, scale) {
        this.sprite = sprite;
        this.startPosX = startPosX;
        this.startPosY = startPosY;
        this.height = height;
        this.width = width;
        this.framesNum = framesNum;
        this.scale = scale;
		this.margin = margin;
    }

    DrawFrame(PosX, PosY, Frame)
    {
        context.drawImage(this.sprite, this.startPosX + (this.width + 2*this.margin) * Frame, this.startPosY, this.width, this.height, PosX, PosY, this.width * this.scale, this.height * this.scale);
    }
}
class AnimatedSprite
{
    currentFrame = 0;
    timer = 0.0;
    frameTime = 0;
    constructor(sprite, fps, startPosX, startPosY, height, width, framesNum, scale) {
        this.sprite = sprite;
        this.fps = fps;
        this.frameTime = 1.0/fps;
        this.startPosX = startPosX;
        this.startPosY = startPosY;
        this.height = height;
        this.width = width;
        this.framesNum = framesNum;
        this.scale = scale;
    }

    Update(DeltaTime)
    {
        this.timer += DeltaTime;

        if(this.timer >= this.frameTime)
        {
            this.timer -= this.frameTime;
            this.currentFrame = (this.currentFrame + 1)%this.framesNum;
        }
    }

    Draw(PosX, PosY)
    {
        context.drawImage(this.sprite, this.startPosX + this.width * this.currentFrame, this.startPosY, this.width, this.height, PosX, PosY, this.width * this.scale, this.height * this.scale);
    }
}