import "./SoundEffectsButton.css";

function SoundEffectsButton({
  soundEffectsEnabled,
  toggleSoundEffects,
  onKeyDown,
}) {
  return (
    <button
      className="music-button"
      style={
        soundEffectsEnabled
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
      onClick={toggleSoundEffects}
      onKeyDown={onKeyDown}
    >
      {`SFX ${soundEffectsEnabled ? "ON" : "OFF"}`}
    </button>
  );
}

export default SoundEffectsButton;
