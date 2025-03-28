import "./RestartGameCover.css";
import plainsImage from "../../images/plains.gif";
import skullImage from "../../images/skull-laugh.gif";
import { GAME_STATE, gameGrid } from "../GameGrid/GameGrid";

function RestartGameCover({
  handleGameMainMenu,
  handleGameStart,
  scoreDisplayed,
  ref,
}) {
  return (
    <>
      <div
        className="restart-game-cover"
        style={{
          height: gameGrid.height,
          width: gameGrid.width,
          backgroundColor: "black",
          borderColor: "green",
        }}
        ref={ref}
      >
        <img
          src={plainsImage}
          style={{
            position: "absolute",
            height: "100%",
            borderRadius: "5px",
            zIndex: 2,
            opacity: 0.8,
          }}
        />
        <img
          src={skullImage}
          style={{
            position: "absolute",
            height: "30%",
            borderRadius: "5px",
            zIndex: 2,
            top: "30px",
          }}
        />
        <div className="final-score" style={{ fontSize: "50px", zIndex: 4 }}>
          FINAL SCORE
          <div style={{ fontSize: "70px", fontWeight: "700" }}>
            {scoreDisplayed}
          </div>
        </div>
        <button
          style={{ zIndex: 3, width: "300px" }}
          onClick={() => {
            handleGameStart();
          }}
          className="restart-button"
        >
          RESTART
        </button>
        <br />
        <button
          className="main-menu-button"
          onClick={() => {
            handleGameMainMenu();
          }}
        >
          MAIN MENU
        </button>
      </div>
    </>
  );
}

export default RestartGameCover;
