import "./StartGameCover.css";

import plainsImage from "../../images/plains.gif";
import heroImage from "../../images/hero.gif";
import { gameGrid } from "../GameGrid/GameGrid";
import { useRef } from "react";

function StartGameCover({ handleGameStart, playBlankAudio, ref }) {
  return (
    <>
      <div
        className="start-game-cover"
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
          src={heroImage}
          style={{
            position: "absolute",
            height: "60%",
            borderRadius: "5px",
            zIndex: 2,
            top: "150px",
          }}
        />
        <div className="title">KNIGHT vs GHOST</div>
        <button
          style={{ zIndex: 3 }}
          onClick={() => {
            handleGameStart();
          }}
        >
          START
        </button>
      </div>
    </>
  );
}

export default StartGameCover;
