import { GameState_Fade } from "./GameState_Fade.js";
import { GameState_Menu } from "./GameState_Menu.js";
import { GameState_Game } from "./GameState_Game.js";

class GameStateMachine
{
    constructor()
    {
        this.GameState_Fade = new GameState_Fade();
        this.GameState_Menu = new GameState_Menu();
        this.GameState_Game = new GameState_Game();
        this.CurrentState = this.GameState_Menu;
    }

    SetCurrentState(NewState)
    {
        this.CurrentState = NewState;
    }
    Update(DeltaTime)
    {
        this.CurrentState.Update(DeltaTime);
    }

    Draw()
    {
        this.CurrentState.Draw();
    }
}