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

const KolejnoscRysowania = {
	Postacie : 0,
	BombyEksplozje : 1,
	PowerUpy : 2,
	Cegly : 3
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

	GetPosX()
	{
		return this.Pos_X;
	}

	GetPosY()
	{
		return this.Pos_Y;
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
	Scale = GameScale;
	DynamicObjects = [];

	constructor(SizeX, SizeY)
	{
		this.Sprite = new Image();
		this.Sprite.src = "DynablasteOnline.png";
		this.TilesGfx = new StaticSprite(this.Sprite, 2, 131, 16, 16, 19, 1, this.Scale);
		this.SizeX = 2*SizeX+3;
		this.SizeY = 2*SizeY+3;
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

		let LiczbaPrzeciwnikow = 5;

		//Dodajemy pomaranczowe cegly
		for(let y= 1; y < this.SizeY-1; y++)
		{
			for (let x = 1; x < this.SizeX - 1; x++)
			{
				// Nie chcemy cegiel w punktach startowych gracza, oraz w bezposrednim sasiedztwie
				if(!(
					(x == 1) && (y == 1)
					||
					(x == 1) && (y == 2)
					||
					(x == 2) && (y == 1)
					||
					(x == this.SizeX - 2) && (y == this.SizeY - 2)
					||
					(x == this.SizeX - 2) && (y == this.SizeY - 3)
					||
					(x == this.SizeX - 3) && (y == this.SizeY - 2)
					||
					(x == 1) && (y == this.SizeY - 2)
					||
					(x == 1) && (y == this.SizeY - 3)
					||
					(x == 2) && (y == this.SizeY - 2)
					||
					(x == this.SizeX - 2) && (y == 1)
					||
					(x == this.SizeX - 3) && (y == 1)
					||
					(x == this.SizeX - 2) && (y == 2)
				))
				{
					if(!this.Level[x][y].HasCollision)
					{
						let chance = 65;
						if(Math.random() * 100 < chance)
						{
							this.AddActor(x, y, new Brick());
						}
						else if(Math.random() * 100 < 10 && LiczbaPrzeciwnikow > 0)
						{
							LiczbaPrzeciwnikow--;
							this.AddActor(x, y, new Enemy());
						}
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

		for (let i = 0; i < this.DynamicObjects.length; i++) 
		{
			this.DynamicObjects[i].Draw();
		}
	}

	GetPosX()
	{
		return 0;
	}

	GetPosY()
	{
		return 0;
	}

	Update(DeltaTime)
	{
		for (let i = 0; i < this.DynamicObjects.length; i++) 
		{
			this.DynamicObjects[i].Update(DeltaTime);
		}

		this.DynamicObjects.sort(function(a, b) {
			return b.KolejnoscRysowania - a.KolejnoscRysowania;
		});
	}

	PixelToTile(PointX, PointY)
	{
		let tileSize = this.Scale * 16.0;
		let x = Math.floor(PointX/tileSize);
		let y = Math.floor(PointY/tileSize);
		return { x, y };
	}

	TileToPixel(TileX, TileY)
	{
		let tileSize = this.Scale * 16.0;
		let x = TileX * tileSize;
		let y = TileY * tileSize;
		return { x, y };
	}

	HasCollisionWithRect(CollisionBox)
	{
		let HasCollision = false;
		let CollidingObjects = [];

		for(let y= 0; y<this.SizeY; y++)
		{
			for(let x= 0; x<this.SizeX; x++)
			{
				if(this.Level[x][y].HasCollisionWithRect(CollisionBox))
				{
					HasCollision = true;
					CollidingObjects.push(this.Level[x][y]);
				}
			}
		}

		for (let i = 0; i < this.DynamicObjects.length; i++)
		{
			if(this.DynamicObjects[i].Collision.HasCollisionWithRect(CollisionBox))
			{
				HasCollision = true;
				CollidingObjects.push(this.DynamicObjects[i]);
			}

		}

		return {HasCollision, CollidingObjects};
	}
	HasTileCollision(TileX, TileY)
	{
		let HasCollision = false;
		let CollidingObjects = [];

		if(TileX < this.SizeX && TileY < this.SizeY && TileX >= 0 && TileY >= 0)
		{
			if(this.Level[TileX][TileY].HasCollision)
			{
				HasCollision = true;
			}
			else
			{
				let tileSize = this.Scale * 16.0;
				let Collision = new RectangleCollision(TileX * tileSize, TileY * tileSize, tileSize, tileSize);
				for (let i = 0; i < this.DynamicObjects.length; i++)
				{
					if(this.DynamicObjects[i].Collision.HasCollisionWithRect(Collision))
					{
						HasCollision = true;
						CollidingObjects.push(this.DynamicObjects[i]);
					}
				}
			}
		}
		else
		{
			HasCollision = true;
		}

		return {HasCollision, CollidingObjects};
	}

	GetCollidingObjects(CollisionBox)
	{
		let Result = [];

		for (let i = 0; i < this.DynamicObjects.length; i++)
		{
			if(this.DynamicObjects[i].Collision.HasCollisionWithRect(CollisionBox))
				Result.push(this.DynamicObjects[i]);
		}

		return Result;
	}

	HasCollisionWithPoint(PointX, PointY)
	{
		let TileCoord = this.PixelToTile(PointX, PointY);
		if(!this.Level[TileCoord.x][TileCoord.y].HasCollisionWithPoint(PointX, PointY))
		{
			for (let i = 0; i < this.DynamicObjects.length; i++)
			{
				if(this.DynamicObjects[i].Collision.HasCollisionWithPoint(PointX, PointY))
				{
					if(this.DynamicObjects[i].Collision.CollisionFlags == CollisionFlags.Block)
						return true;
				}

			}
			return false;
		}
		else
			return true;
	}

	GetNearestXOutsideCollision(PointX, PointY)
	{
		let TileCoord = this.PixelToTile(PointX, PointY);

		if(!this.Level[TileCoord.x][TileCoord.y].HasCollisionWithPoint(PointX, PointY))
		{
			for (let i = 0; i < this.DynamicObjects.length; i++)
			{
				if(this.DynamicObjects[i].Collision.HasCollisionWithPoint(PointX, PointY))
					return this.DynamicObjects[i].Collision.GetNearestXOutsideCollision(PointX, PointY);
			}
		}

		return this.Level[TileCoord.x][TileCoord.y].Collision.GetNearestXOutsideCollision(PointX, PointY);
	}

	GetNearestYOutsideCollision(PointX, PointY)
	{
		let TileCoord = this.PixelToTile(PointX, PointY);

		if(!this.Level[TileCoord.x][TileCoord.y].HasCollisionWithPoint(PointX, PointY))
		{
			for (let i = 0; i < this.DynamicObjects.length; i++)
			{
				if(this.DynamicObjects[i].Collision.HasCollisionWithPoint(PointX, PointY))
					return this.DynamicObjects[i].Collision.GetNearestYOutsideCollision(PointX, PointY);
			}
		}

		return this.Level[TileCoord.x][TileCoord.y].Collision.GetNearestYOutsideCollision(PointX, PointY);
	}

	AddActor(Tile_X, Tile_Y, NewActor)
	{
		let tileSize = this.Scale * 16.0;
		NewActor.SetPos(Tile_X * tileSize, Tile_Y * tileSize);
		NewActor.SetParent(this);
		NewActor.BeginPlay();
		this.DynamicObjects.push(NewActor);
	}

	RemoveObject(ObjectToRemove)
	{
		const index = this.DynamicObjects.indexOf(ObjectToRemove);
		this.DynamicObjects.splice(index, 1);
	}
}