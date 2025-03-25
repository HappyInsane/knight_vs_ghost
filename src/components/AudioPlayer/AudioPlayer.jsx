import React, { useState, useEffect, useRef } from "react";
//audios
import startAudioFile from "../../audios/main_menu_song.mp3";
import runningAudioFile from "../../audios/gamming_song.mp3";
import restartAudioFile from "../../audios/death_song.mp3";
import { GAME_STATE } from "../GameGrid/GameGrid";

function AudioPlayer({ gameState, musicEnabled }) {
  const startAudio = useRef(new Audio(startAudioFile));
  const runningAudio = useRef(new Audio(runningAudioFile));
  const restartAudio = useRef(new Audio(restartAudioFile));

  const playAudio = (audio) => {
    if (audio) {
      audio.current.currentTime = 0; // Reset audio to start
      audio.current
        .play()
        .catch((error) => console.error("Audio playback error:", error));
    }
  };

  const stopAllAudio = () => {
    if (startAudio.current) startAudio.current.pause();
    if (runningAudio.current) runningAudio.current.pause();
    if (restartAudio.current) restartAudio.current.pause();
  };

  useEffect(() => {
    if (musicEnabled) {
      if (gameState === GAME_STATE.START) {
        stopAllAudio();
        playAudio(startAudio);
      } else if (gameState === GAME_STATE.RUNNING) {
        stopAllAudio();
        playAudio(runningAudio);
      } else if (gameState === GAME_STATE.RESTART) {
        stopAllAudio();
        playAudio(restartAudio);
      }
    } else {
      stopAllAudio();
    }
  }, [gameState, musicEnabled]);
}

export default AudioPlayer;
