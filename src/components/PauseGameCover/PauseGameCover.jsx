import "./PauseGameCover.css";
import { gameGrid } from "../GameGrid/GameGrid";
import loadingImage from "../../images/hourglass-time.gif";

function PauseGameCover({ handleUnpause, ref }) {
  return (
    <>
      <div
        className="pause-game-cover"
        style={{ height: gameGrid.height, width: gameGrid.width }}
        onKeyDown={(e) => {
          if (e.key === "Escape") handleUnpause();
        }}
        tabIndex={0}
        ref={ref}
      >
        <div className="pause-game-cover-title">PAUSED</div>
        <img
          src={loadingImage}
          style={{ opacity: 0.4, height: 100, marginBottom: 80 }}
        />
        <button className="resume-button" onClick={handleUnpause}>
          RESUME
        </button>
      </div>
    </>
  );
}

export default PauseGameCover;
