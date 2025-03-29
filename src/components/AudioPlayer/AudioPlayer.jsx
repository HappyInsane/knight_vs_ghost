import React, { useEffect, useState } from "react";
import useSound from "use-sound";
import { GAME_STATE } from "../GameGrid/GameGrid";
//audios
import startAudioFile from "../../audios/main_menu_song.mp3";
import runningAudioFile from "../../audios/gamming_song.mp3";
import restartAudioFile from "../../audios/death_song.mp3";
import pauseAudioFile from "../../audios/pause.mp3";

function AudioPlayer({ gameState, musicEnabled, handleMusicLoaded }) {
  const [startLoaded, setStartLoaded] = useState(false);
  const [runningLoaded, setRunningLoaded] = useState(false);
  const [restartLoaded, setRestartLoaded] = useState(false);
  const [pauseLoaded, setPauseLoaded] = useState(false);

  const [startError, setStartError] = useState(false);
  const [runningError, setRunningError] = useState(false);
  const [restartError, setRestartError] = useState(false);
  const [pauseError, setPauseError] = useState(false);

  const [startAudio, startAudioControls] = useSound(startAudioFile, {
    onload: () => setStartLoaded(true),
    onloaderror: () => setStartError(true),
    loop: true,
    volume: 0.2,
  });

  const [runningAudio, runningAudioControls] = useSound(runningAudioFile, {
    onload: () => setRunningLoaded(true),
    onloaderror: () => setRunningError(true),
    loop: true,
    volume: 0.2,
  });

  const [restartAudio, restartAudioControls] = useSound(restartAudioFile, {
    onload: () => setRestartLoaded(true),
    onloaderror: () => setRestartError(true),
    loop: true,
    volume: 0.2,
  });

  const [pauseAudio, pauseAudioControls] = useSound(pauseAudioFile, {
    onload: () => setPauseLoaded(true),
    onloaderror: () => setPauseError(true),
    loop: true,
    volume: 0.7,
  });

  const stopAllAudio = () => {
    startAudioControls.stop();
    runningAudioControls.stop();
    restartAudioControls.stop();
    pauseAudioControls.stop();
  };

  useEffect(() => {
    if (musicEnabled) {
      if (gameState === GAME_STATE.START && startLoaded) {
        stopAllAudio();
        startAudio();
      } else if (gameState === GAME_STATE.RUNNING && runningLoaded) {
        stopAllAudio();
        runningAudio();
      } else if (gameState === GAME_STATE.RESTART && restartLoaded) {
        stopAllAudio();
        restartAudio();
      } else if (gameState === GAME_STATE.PAUSED && pauseLoaded) {
        stopAllAudio();
        pauseAudio();
      }
    } else {
      stopAllAudio();
    }
  }, [
    gameState,
    musicEnabled,
    startLoaded,
    runningLoaded,
    restartLoaded,
    pauseLoaded,
  ]);

  useEffect(() => {
    if (startLoaded && runningLoaded && restartLoaded && pauseLoaded) {
      handleMusicLoaded();
    }
  }, [startLoaded, runningLoaded, restartLoaded, pauseLoaded]);

  useEffect(() => {
    if (startError || runningError || restartError || pauseError) {
      console.error("Audio loading error detected");
    }
  }, [startError, runningError, restartError, pauseError]);

  return null;
}

export default AudioPlayer;
