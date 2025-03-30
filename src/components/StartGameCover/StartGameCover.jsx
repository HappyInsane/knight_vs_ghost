import "./StartGameCover.css";
import { useState } from "react";

import plainsImage from "../../images/plains.gif";
import heroImage from "../../images/hero.gif";
import { gameGrid } from "../GameGrid/GameGrid";
import ControlsGameCover from "../ControlsGameCover/ControlsGameCover";
import LeaderBoardCover from "../LeaderBoardCover/LeaderBoardCover";

function StartGameCover({ handleGameStart, ref }) {
  const [controlsCoverVisibility, setControlsCoverVisibility] = useState(false);
  const [leaderBoardCoverVisibility, setLeaderBoardCoverVisibility] =
    useState(false);
  return (
    <>
      {controlsCoverVisibility && (
        <ControlsGameCover
          handleControlsCoverClose={() => setControlsCoverVisibility(false)}
        />
      )}
      {leaderBoardCoverVisibility && (
        <LeaderBoardCover
          handleLeaderBoardCoverClose={() =>
            setLeaderBoardCoverVisibility(false)
          }
        />
      )}
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
            borderRadius: "10px",
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
          className="start-button"
          onClick={() => {
            handleGameStart();
          }}
        >
          START
        </button>
        <button
          className="controls-button"
          style={{ width: 180 }}
          onClick={() => {
            setLeaderBoardCoverVisibility(true);
          }}
        >
          LEADERBOARD
        </button>
        <button
          className="controls-button"
          onClick={() => {
            setControlsCoverVisibility(true);
          }}
        >
          CONTROLS
        </button>
      </div>
    </>
  );
}

export default StartGameCover;
