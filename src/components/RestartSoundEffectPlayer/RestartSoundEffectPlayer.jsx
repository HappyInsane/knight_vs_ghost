import { GAME_STATE } from "../GameGrid/GameGrid";
import { useEffect, useState } from "react";
import useSound from "use-sound";
import skullLaughAudioFile from "../../audios/evil_laugh.mp3";

function RestartSoundEffectPlayer({ gameState, soundEffectsEnabled }) {
  const [skullLaughAudio] = useSound(skullLaughAudioFile, {
    sprite: { cropped: [1000, 500] },
  });

  const [loopNotification, setLoopNotification] = useState(false);

  useEffect(() => {
    if (gameState === GAME_STATE.RESTART && soundEffectsEnabled) {
      setTimeout(() => {
        if (soundEffectsEnabled) {
          skullLaughAudio({ id: "cropped" });
        }
        setLoopNotification(!loopNotification);
      }, 1280);
    }
  }, [gameState, loopNotification, soundEffectsEnabled]);
}

export default RestartSoundEffectPlayer;
