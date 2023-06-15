
class StaticSprite
{
    currentFrame = 0;
    constructor(sprite, startPosX, startPosY, width, height, framesNum, margin, scale) {
        this.sprite = sprite;
        this.startPosX = startPosX;
        this.startPosY = startPosY;
        this.width = width;
        this.height = height;
        this.framesNum = framesNum;
        this.margin = margin;
        this.scale = scale;
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
    OnAnimationEnded = { Instance : null, Function : null};

    Enabled = true;
    constructor(sprite, fps, startPosX, startPosY, width, height, framesNum, margin, scale, looped= true) {
        this.sprite = sprite;
        this.fps = fps;
        this.frameTime = 1.0/fps;
        this.startPosX = startPosX;
        this.startPosY = startPosY;
        this.width = width;
        this.height = height;
        this.framesNum = framesNum;
        this.margin = margin;
        this.scale = scale;
        this.looped = looped;
    }

    Update(DeltaTime)
    {
        if(!this.Enabled)
            return;

        this.timer += DeltaTime;

        if(this.timer >= this.frameTime)
        {
            this.timer -= this.frameTime;
            this.currentFrame = (this.currentFrame + 1)%this.framesNum;

            if(this.currentFrame == 0)
            {
                if(this.OnAnimationEnded.Instance != null && this.OnAnimationEnded.Function != null)
                    this.OnAnimationEnded.Function.call(this.OnAnimationEnded.Instance);

                if(!this.looped)
                    this.Enabled = false;
            }
        }
    }

    Draw(PosX, PosY)
    {
        context.drawImage(this.sprite, this.startPosX + (this.width + 2*this.margin) * this.currentFrame, this.startPosY, this.width, this.height, PosX, PosY, this.width * this.scale, this.height * this.scale);
    }
}