import React from "react";

function AudioButton({ musicEnabled, toggleMusic, onKeyDown, musicLoaded }) {
  return (
    <>
      <button
        className="music-button"
        style={
          musicEnabled
            ? {
                borderColor: "rgb(0, 209, 0)",
                color: "rgb(0, 209, 0)",
                backgroundColor: "rgb(0, 0, 0)",
              }
            : {
                borderColor: "rgb(0, 161, 0)",
                color: "rgb(0, 161, 0)",
                backgroundColor: "rgba(0, 0, 0, 0.637)",
              }
        }
        onClick={toggleMusic}
        onKeyDown={onKeyDown}
        disabled={!musicLoaded}
      >
        {!musicLoaded
          ? "MUSIC Loading..."
          : `MUSIC ${musicEnabled ? "ON" : "OFF"}`}
      </button>
    </>
  );
}

export default AudioButton;
