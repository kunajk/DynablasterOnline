
const Tiles = {
	TRAWA: 0,
	TRAWA_CIEN: 1,
	MUREK: 2,
	NIEZNISZCZALNY_MUR: 3,
	RAMKA_LEWO: 4,
	RAMKA_SRODEK_1: 5,
	RAMKA_SRODEK_2: 6,
	RAMKA_PRAWO: 7,
	RAMKA_BOK_PRAWO_1: 8,
	RAMKA_BOK_PRAWO_2: 9,
	RAMKA_BOK_PRAWO_3: 10,
	RAMKA_DOL_1: 11,
	RAMKA_BOK_LEWO_1: 12,
	RAMKA_BOK_LEWO_2: 13,
	RAMKA_BOK_LEWO_3: 14
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
		for(let i= 0; i < this.SizeX; i++)
		{
			this.Level[i] = new Array(this.SizeY);
		}

		this.Level[0][0] = Tiles.RAMKA_LEWO;
		this.Level[this.SizeX-1][0] = Tiles.RAMKA_PRAWO;

		for(let x= 1; x<this.SizeX - 1; x++)
		{
			this.Level[x][0] = Tiles.RAMKA_SRODEK_1 + x%2;
			this.Level[x][1] = Tiles.TRAWA_CIEN;
			this.Level[x][this.SizeY - 1] = Tiles.RAMKA_DOL_1;
		}

		for(let x= 0; x<this.SizeX; x++)
		{
			this.Level[x][this.SizeY - 1] = Tiles.RAMKA_DOL_1;
		}

		for(let y= 1; y<this.SizeY - 1; y++)
		{
			this.Level[0][y] = Tiles.RAMKA_BOK_LEWO_1 + y%3;
			this.Level[this.SizeX - 1][y] = Tiles.RAMKA_BOK_PRAWO_1 + y%3;
		}

		// Trawa
		for(let y= 2; y<this.SizeY-1; y++)
		{
			for(let x= 1; x<this.SizeX - 1; x++)
			{
				if(y%2 == 0 && x%2 == 0)
				{
					this.Level[x][y] = Tiles.NIEZNISZCZALNY_MUR;
				}
				else
				{
					if(x%2 == 0)
					{
						this.Level[x][y] = Tiles.TRAWA_CIEN;
					}
					else
					{
						this.Level[x][y] = Tiles.TRAWA;
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
				this.TilesGfx.DrawFrame( this.Scale*x*16, this.Scale*y*16, this.Level[x][y]);
			}
		}
	}

	Update(DeltaTime)
	{
	}
}