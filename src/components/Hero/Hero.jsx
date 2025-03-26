import { GAME_STATE, gameGrid } from "../GameGrid/GameGrid";
import { useReducer, useEffect, useState, useRef } from "react";
import "./Hero.css";
import heroImage from "../../images/hero.gif";
//SFX
import colectCoinSFXFile from "../../audios/blip.mp3";
import takeDamageSFXFile from "../../audios/hit.mp3";
import deathSFXFile from "../../audios/death.mp3";
import useSound from "use-sound";

const ACTIONS = {
  MOVE: "move",
  COLECT_COIN: "colect-coin",
  TAKE_DAMAGE: "take-damage",
  TOGGLE_INVULNERABILITY: "toggle-invulnerability",
  RESET: "reset",
};

export const hero = {
  height: 40,
  width: 40,
  jump: 50 / 2,
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.MOVE:
      switch (action.payload.direction) {
        case "ArrowUp":
          if (state.position[1] - hero.jump - hero.height / 2 < 0) {
            return state;
          } else {
            return {
              ...state,
              position: [state.position[0], state.position[1] - hero.jump],
            };
          }
        case "ArrowDown":
          if (
            state.position[1] + hero.jump + hero.height / 2 >
            gameGrid.height
          ) {
            return state;
          } else {
            return {
              ...state,
              position: [state.position[0], state.position[1] + hero.jump],
            };
          }
        case "ArrowLeft":
          if (state.position[0] - hero.jump - hero.width / 2 < 0) {
            return state;
          } else {
            return {
              ...state,
              position: [state.position[0] - hero.jump, state.position[1]],
            };
          }
        case "ArrowRight":
          if (state.position[0] + hero.jump + hero.width / 2 > gameGrid.width) {
            return state;
          } else {
            return {
              ...state,
              position: [state.position[0] + hero.jump, state.position[1]],
            };
          }
        default:
          return state;
      }
    case ACTIONS.COLECT_COIN:
      return { ...state, coinCount: state.coinCount + 1 };
    case ACTIONS.TAKE_DAMAGE:
      return { ...state, liveCount: state.liveCount - 1 };
    case ACTIONS.TOGGLE_INVULNERABILITY:
      return { ...state, invulnerability: !state.invulnerability };
    case ACTIONS.RESET:
      return {
        ...state,
        liveCount: 3,
        coinCount: 0,
        position: [(gameGrid.width - 6) / 2, (gameGrid.height - 6) / 2],
        invulnerability: false,
      };
    default:
      return state;
  }
}

function Hero({
  userInput,
  rerender,
  handleDisplayStats,
  handleNotifyPosition,
  coinColectionNotification,
  heroIsHitNotification,
  handleHeroIsHitAnimation,
  handleSetFinalScore,
  gameState,
  soundEffectsEnabled,
}) {
  const [gameIsRunning, setGameIsRunning] = useState(false);

  useEffect(() => {
    if (gameState === GAME_STATE.RUNNING) {
      setGameIsRunning(true);
    } else {
      setGameIsRunning(false);
    }
  }, [gameState]);

  const [state, dispatch] = useReducer(reducer, {
    liveCount: 3,
    coinCount: 0,
    position: [(gameGrid.width - 6) / 2, (gameGrid.height - 6) / 2],
    invulnerability: false,
  });

  useEffect(() => {
    if (gameIsRunning) {
      dispatch({ type: ACTIONS.MOVE, payload: { direction: userInput } });
    }
  }, [userInput, rerender]);

  useEffect(() => {
    handleDisplayStats(state.liveCount, state.coinCount);
  }, [state.coinCount, state.liveCount]);

  useEffect(() => {
    handleNotifyPosition(state.position);
  }, [state.position]);

  useEffect(() => {
    if (gameIsRunning) {
      dispatch({ type: ACTIONS.COLECT_COIN });
    }
  }, [coinColectionNotification]);

  useEffect(() => {
    if (!state.invulnerability && gameIsRunning) {
      dispatch({ type: ACTIONS.TAKE_DAMAGE });
      handleHeroIsHitAnimation();

      //react reads the previous render, the real/next render for this value would be 0
      if (state.liveCount === 1) {
        handleSetFinalScore(state.coinCount);
        dispatch({ type: ACTIONS.RESET });
      } else {
        dispatch({ type: ACTIONS.TOGGLE_INVULNERABILITY });
        setTimeout(() => {
          dispatch({ type: ACTIONS.TOGGLE_INVULNERABILITY });
        }, 3000);
      }
    }
  }, [heroIsHitNotification]);

  //hero facing direction
  const [faceDirection, setFaceDirection] = useState(true);

  useEffect(() => {
    if (userInput == "ArrowLeft") {
      setFaceDirection(false);
    } else if (userInput == "ArrowRight") {
      setFaceDirection(true);
    }
  }, [userInput]);

  //Sound Effects
  const [takeDamageSFX] = useSound(takeDamageSFXFile);
  const [colectCoinSFX] = useSound(colectCoinSFXFile);
  const [deathSFX] = useSound(deathSFXFile);

  useEffect(() => {
    if (!soundEffectsEnabled) return;
    if (gameIsRunning && state.liveCount !== 3) {
      takeDamageSFX();
    }
    if (gameState === GAME_STATE.RESTART) {
      deathSFX();
    }
  }, [state.liveCount]);

  useEffect(() => {
    if (!soundEffectsEnabled) return;
    if (gameIsRunning && state.coinCount !== 0) {
      colectCoinSFX();
    }
  }, [state.coinCount]);

  return (
    <>
      <div
        className="hero"
        style={{
          height: hero.height,
          width: hero.width,
          top: state.position[1],
          left: state.position[0],
        }}
      >
        <img
          src={heroImage}
          style={{
            height: "140%",
            transform: faceDirection ? "scaleX(1)" : "scaleX(-1)",
            opacity: state.invulnerability ? 0.6 : 1,
          }}
        />
      </div>
    </>
  );
}

export default Hero;
