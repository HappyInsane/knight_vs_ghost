import "./ControlsGameCover.css";
import { gameGrid } from "../GameGrid/GameGrid";
import arrowImage from "../../images/ArrowKeys_Pixel.png";
import keysImage from "../../images/WASD_Pixel.png";
import spacebarImage from "../../images/Spacebar_Pixel.png";

function ControlsGameCover({ handleControlsCoverClose }) {
  return (
    <>
      <div
        className="controls-game-cover"
        style={{ width: gameGrid.width, height: gameGrid.height }}
      >
        <div className="header">
          Controls
          <button className="close-button" onClick={handleControlsCoverClose}>
            X
          </button>
        </div>
        <div className="control-options-title">Move</div>
        <div className="control-options">
          <div className="control-option">
            <img style={{ height: "150px", marginLeft: 20 }} src={keysImage} />
          </div>
          <div className="control-option">OR</div>
          <div className="control-option">
            <img
              style={{ height: "150px", marginRight: 20 }}
              src={arrowImage}
            />
          </div>
        </div>
        <div className="control-options-title">Dash</div>
        <div style={{ fontSize: 15, opacity: 0.5 }}>
          Dashing makes you invulnerable for the entire duration of the dash
        </div>
        <div className="control-options">
          <div className="control-option">
            <img style={{ height: "70px" }} src={spacebarImage} />
          </div>
        </div>
      </div>
    </>
  );
}

export default ControlsGameCover;
