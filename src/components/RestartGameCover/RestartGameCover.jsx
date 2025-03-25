import "./RestartGameCover.css";
import plainsImage from "../../images/plains.gif";
import skullImage from "../../images/skull-laugh.gif";
import { GAME_STATE, gameGrid } from "../GameGrid/GameGrid";
import { useRef, useEffect, useState } from "react";
import skullLaughAudioFile from "../../audios/evil_laugh.mp3";

function RestartGameCover({
  handleGameMainMenu,
  handleGameStart,
  scoreDisplayed,
  gameState,
  ref,
}) {
  const skullLaughAudio = useRef(new Audio(skullLaughAudioFile));
  const [laughAudioNotification, setLaughAudioNotification] = useState(false);

  useEffect(() => {
    if (gameState === GAME_STATE.RESTART) {
      skullLaughAudio.current.currentTime = 1;
      skullLaughAudio.current.play();
      setTimeout(() => {
        skullLaughAudio.current.pause();
      }, 1000);
      setTimeout(() => {
        setLaughAudioNotification(!laughAudioNotification);
      }, 1400);
    }
  }, [gameState, laughAudioNotification]);

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
