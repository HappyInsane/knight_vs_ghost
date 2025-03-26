import { useEffect } from "react";
import useSound from "use-sound";
import { GAME_STATE } from "../GameGrid/GameGrid";
//audios
import startAudioFile from "../../audios/main_menu_song.mp3";
import runningAudioFile from "../../audios/gamming_song.mp3";
import restartAudioFile from "../../audios/death_song.mp3";

function AudioPlayer({ gameState, musicEnabled }) {
  const [startAudio, startAudioControls] = useSound(startAudioFile);
  const [runningAudio, runningAudioControls] = useSound(runningAudioFile);
  const [restartAudio, restartAudioControls] = useSound(restartAudioFile);

  const stopAllAudio = () => {
    startAudioControls.stop();
    runningAudioControls.stop();
    restartAudioControls.stop();
  };

  useEffect(() => {
    if (musicEnabled) {
      if (gameState === GAME_STATE.START) {
        stopAllAudio();
        startAudio();
      } else if (gameState === GAME_STATE.RUNNING) {
        stopAllAudio();
        runningAudio();
      } else if (gameState === GAME_STATE.RESTART) {
        stopAllAudio();
        restartAudio();
      }
    }
  }, [gameState, musicEnabled]);
}

export default AudioPlayer;
