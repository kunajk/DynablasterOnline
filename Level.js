
const Tiles = {
	TRAWA: {Index: 0, Collision: false},
	TRAWA_CIEN: {Index: 1, Collision: false},
	MUREK: {Index: 2, Collision: true},
	NIEZNISZCZALNY_MUR: {Index: 3, Collision: true},
	RAMKA_LEWO: {Index: 4, Collision: true},
	RAMKA_SRODEK_1: {Index: 5, Collision: true},
	RAMKA_SRODEK_2: {Index: 6, Collision: true},
	RAMKA_PRAWO: {Index: 7, Collision: true},
	RAMKA_BOK_PRAWO_1: {Index: 8, Collision: true},
	RAMKA_BOK_PRAWO_2: {Index: 9, Collision: true},
	RAMKA_BOK_PRAWO_3: {Index: 10, Collision: true},
	RAMKA_DOL_1: {Index: 11, Collision: true},
	RAMKA_BOK_LEWO_1: {Index: 12, Collision: true},
	RAMKA_BOK_LEWO_2: {Index: 13, Collision: true},
	RAMKA_BOK_LEWO_3: {Index: 14, Collision: true}
}

class Tile
{
	constructor(Pos_X, Pos_Y, Sprite, TileData, SizeX, SizeY)
	{
		this.Pos_X = Pos_X;
		this.Pos_Y = Pos_Y;
		this.Sprite = Sprite;
		this.SpriteIndex = TileData.Index;
		this.HasCollision = TileData.Collision;
		this.SizeX = SizeX;
		this.SizeY = SizeY;
		this.Collision = new RectangleCollision(Pos_X, Pos_Y, SizeX, SizeY);
	}

	SetTileData(TileData)
	{
		this.SpriteIndex = TileData.Index;
		this.HasCollision = TileData.Collision;
	}

	HasCollisionWithRect(OtherRectCoision)
	{
		return this.HasCollision && this.Collision.HasCollisionWithRect(OtherRectCoision);
	}

	HasCollisionWithPoint(PointX, PointY)
	{
		return this.HasCollision && this.Collision.HasCollisionWithPoint(PointX, PointY);
	}

	Draw()
	{
		this.Sprite.DrawFrame(this.Pos_X, this.Pos_Y, this.SpriteIndex);
		
		if(this.HasCollision)
			this.Collision.DebugDraw();
	}
}

class Level
{
	Scale = 4;
	constructor(SizeX, SizeY)
	{
		this.Sprite = new Image();
		this.Sprite.src = "DynablasteOnline.png";
		this.TilesGfx = new StaticSprite(this.Sprite, 2, 131, 16, 16, 19, 1, this.Scale);
		this.SizeX = SizeX;
		this.SizeY = SizeY;
	}

	TworzMape()
	{
		//Tablica przechowujaca plansze
		this.Level = new Array(this.SizeX);
		for(let x = 0; x < this.SizeX; x++)
		{
			this.Level[x] = new Array(this.SizeY);
			
			for( let y = 0; y < this.SizeY; y++)
			{
				this.Level[x][y] = new Tile(this.Scale*x*16, this.Scale*y*16, this.TilesGfx, Tiles.TRAWA, this.Scale*16, this.Scale*16);
			}
		}

		this.Level[0][0].SetTileData(Tiles.RAMKA_LEWO);
		this.Level[this.SizeX-1][0].SetTileData(Tiles.RAMKA_PRAWO);

		for(let x= 1; x<this.SizeX - 1; x++)
		{
			this.Level[x][0].SetTileData([Tiles.RAMKA_SRODEK_1, Tiles.RAMKA_SRODEK_2][x%2]);
			this.Level[x][1].SetTileData(Tiles.TRAWA_CIEN);
			this.Level[x][this.SizeY - 1].SetTileData(Tiles.RAMKA_DOL_1);
		}

		for(let x= 0; x<this.SizeX; x++)
		{
			this.Level[x][this.SizeY - 1].SetTileData(Tiles.RAMKA_DOL_1);
		}

		for(let y= 1; y<this.SizeY - 1; y++)
		{
			this.Level[0][y].SetTileData([Tiles.RAMKA_BOK_LEWO_1, Tiles.RAMKA_BOK_LEWO_2, Tiles.RAMKA_BOK_LEWO_3][y%3]);
			this.Level[this.SizeX - 1][y].SetTileData([Tiles.RAMKA_BOK_PRAWO_1, Tiles.RAMKA_BOK_PRAWO_2, Tiles.RAMKA_BOK_PRAWO_3][y%3]);
		}

		// Trawa
		for(let y= 2; y<this.SizeY-1; y++)
		{
			for(let x= 1; x<this.SizeX - 1; x++)
			{
				if(y%2 == 0 && x%2 == 0)
				{
					this.Level[x][y].SetTileData(Tiles.NIEZNISZCZALNY_MUR);
				}
				else
				{
					if(x%2 == 0)
					{
						this.Level[x][y].SetTileData(Tiles.TRAWA_CIEN);
					}
					else
					{
						this.Level[x][y].SetTileData(Tiles.TRAWA);
					}
				}
			}
		}
	}

	Draw()
	{
		for(let y= 0; y<this.SizeY; y++)
		{
			for(let x= 0; x<this.SizeX; x++)
			{
				this.Level[x][y].Draw();
			}
		}
	}

	Update(DeltaTime)
	{
	}

	PixelToTile(PointX, PointY)
	{
		let tileSize = this.Scale * 16.0;
		let x = Math.floor(PointX/tileSize);
		let y = Math.floor(PointY/tileSize);
		return { x, y };
	}

	HasCollisionWithPoint(PointX, PointY)
	{
		let TileCoord = this.PixelToTile(PointX, PointY);
		return this.Level[TileCoord.x][TileCoord.y].HasCollisionWithPoint(PointX, PointY);
	}

	GetNearestXOutsideCollision(PointX, PointY)
	{
		let TileCoord = this.PixelToTile(PointX, PointY);
		return this.Level[TileCoord.x][TileCoord.y].Collision.GetNearestXOutsideCollision(PointX, PointY);
	}

	GetNearestYOutsideCollision(PointX, PointY)
	{
		let TileCoord = this.PixelToTile(PointX, PointY);
		return this.Level[TileCoord.x][TileCoord.y].Collision.GetNearestYOutsideCollision(PointX, PointY);
	}
}