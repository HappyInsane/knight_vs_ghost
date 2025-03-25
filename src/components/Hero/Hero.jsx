import { GAME_STATE, gameGrid } from "../GameGrid/GameGrid";
import { useReducer, useEffect, useState, useRef } from "react";
import "./Hero.css";
import heroImage from "../../images/hero.gif";
import { colectCoinSFX, deathSFX, takeDamageSFX } from "../../helpers/audioSFX";

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
    //useEffect trigers twice on every page reload, activating TAKE_HIT and COLECT_COIN twice
    //so this compensates
    liveCount: 3 + 2,
    coinCount: 0 - 2,
    position: [(gameGrid.width - 6) / 2, (gameGrid.height - 6) / 2],
    invulnerability: false,
  });

  useEffect(() => {
    dispatch({ type: ACTIONS.MOVE, payload: { direction: userInput } });
  }, [userInput, rerender]);

  useEffect(() => {
    handleDisplayStats(state.liveCount, state.coinCount);
  }, [state.coinCount, state.liveCount]);

  useEffect(() => {
    handleNotifyPosition(state.position);
  }, [state.position]);

  useEffect(() => {
    if (gameIsRunning) {
      playSound(colectCoinSFX);
    }
    dispatch({ type: ACTIONS.COLECT_COIN });
  }, [coinColectionNotification]);

  useEffect(() => {
    if (!state.invulnerability) {
      dispatch({ type: ACTIONS.TAKE_DAMAGE });
      handleHeroIsHitAnimation();

      //react reads the previous render, the real/next render for this value would be 0
      if (state.liveCount === 1) {
        if (gameIsRunning) {
          console.log("play death");
          playSound(deathSFX);
        }
        handleSetFinalScore(state.coinCount);
        dispatch({ type: ACTIONS.RESET });
      } else {
        if (gameIsRunning) {
          console.log("play take hit");
          playSound(takeDamageSFX);
        }
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

  //hero SFX

  const playSound = (audioSFX) => {
    if (audioSFX) {
      audioSFX.currentTime = 0.1;
      audioSFX.play();
    }
  };

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
