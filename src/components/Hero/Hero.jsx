import { GAME_STATE, gameGrid } from "../GameGrid/GameGrid";
import { useReducer, useEffect, useState, useRef } from "react";
import "./Hero.css";
import heroImage from "../../images/hero.gif";
import { contain, translateDirection } from "../../helpers/interaction";
//SFX
import colectCoinSFXFile from "../../audios/blip.mp3";
import takeDamageSFXFile from "../../audios/hit.mp3";
import deathSFXFile from "../../audios/death.mp3";
import dashSFXFile from "../../audios/dash.mp3";
import habilityUpSFXFile from "../../audios/hability_up.mp3";
import useSound from "use-sound";

const ACTIONS = {
  MOVE: "move",
  COLECT_COIN: "colect-coin",
  TAKE_DAMAGE: "take-damage",
  TOGGLE_INVULNERABILITY: "toggle-invulnerability",
  RESET: "reset",
  DASH: "dash",
};

export const hero = {
  height: 40,
  width: 30,
  stepSize: 20,
  dashSize: 70,
};

export const habilitySpec = {
  dash: { coolDown: 4000, duration: 100 },
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.MOVE:
      const futurePosition = [
        state.position[0] +
          action.payload.magnitude * Math.cos(action.payload.direction),
        state.position[1] -
          action.payload.magnitude * Math.sin(action.payload.direction),
      ];
      if (
        !contain(gameGrid, {
          height: hero.height,
          width: hero.width,
          position: futurePosition,
        })
      ) {
        return {
          ...state,
        };
      } else {
        return {
          ...state,
          position: futurePosition,
        };
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
    case ACTIONS.DASH:
      return { ...state };
    default:
      return state;
  }
}

function Hero({
  userInput,
  handleDisplayStats,
  handleNotifyPosition,
  coinColectionNotification,
  heroIsHitNotification,
  handleHeroIsHitAnimation,
  handleSetFinalScore,
  gameState,
  soundEffectsEnabled,
  handleDisplayCooldowns,
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

  //hero movement
  const [listenForAction, setlistenForAction] = useState(false);

  const [moveUp, setMoveUp] = useState(false);
  const [moveDown, setMoveDown] = useState(false);
  const [moveLeft, setMoveLeft] = useState(false);
  const [moveRight, setMoveRight] = useState(false);
  //abilities
  const [performDash, setPerformDash] = useState(false);
  const [dashOnCooldown, setDashOnCooldown] = useState(false);

  const handleResetMovement = () => {
    setMoveUp(false);
    setMoveDown(false);
    setMoveLeft(false);
    setMoveRight(false);
  };

  useEffect(() => {
    if (gameState === GAME_STATE.RUNNING) {
      setTimeout(() => {
        setlistenForAction(!listenForAction);
      }, 50);
    }
  }, [gameState, listenForAction]);

  useEffect(() => {
    if (gameIsRunning && (moveUp || moveDown || moveLeft || moveRight)) {
      const curDirection = translateDirection(
        moveUp,
        moveDown,
        moveLeft,
        moveRight
      );
      if (curDirection) {
        dispatch({
          type: ACTIONS.MOVE,
          payload: {
            direction: curDirection,
            magnitude: performDash ? hero.dashSize : hero.stepSize,
          },
        });
      }

      return;
    }
  }, [listenForAction]);

  useEffect(() => {
    if (gameIsRunning) {
      switch (userInput.value.toLowerCase()) {
        case "w":
        case "arrowup":
          if (userInput.pressed) {
            setMoveUp(true);
          } else {
            setMoveUp(false);
          }
          break;
        case "s":
        case "arrowdown":
          if (userInput.pressed) {
            setMoveDown(true);
          } else {
            setMoveDown(false);
          }
          break;
        case "a":
        case "arrowleft":
          if (userInput.pressed) {
            setMoveLeft(true);
          } else {
            setMoveLeft(false);
          }
          break;
        case "d":
        case "arrowright":
          if (userInput.pressed) {
            setMoveRight(true);
          } else {
            setMoveRight(false);
          }
          break;
        case " ":
          if (userInput.pressed) {
            if (!dashOnCooldown) {
              setPerformDash(true);
              if (soundEffectsEnabled) dashSFX();
              setTimeout(() => {
                setPerformDash(false);
              }, habilitySpec.dash.duration);
              if (!state.invulnerability) {
                dispatch({ type: ACTIONS.TOGGLE_INVULNERABILITY });
                setTimeout(() => {
                  dispatch({ type: ACTIONS.TOGGLE_INVULNERABILITY });
                }, habilitySpec.dash.duration * 1.5);
              }
            }
          }
          break;
        case "escape":
          //if the game is pused before finishing the dash the movement is after unpause needs to be stoped
          handleResetMovement();
          break;
      }
    }
  }, [userInput]);

  //hability cooldowns
  useEffect(() => {
    if (performDash) {
      setDashOnCooldown(true);
      setTimeout(() => {
        setDashOnCooldown(false);
        if (soundEffectsEnabled) habilityUpSFX();
      }, habilitySpec.dash.coolDown);
    }
  }, [performDash]);

  useEffect(() => {
    if (dashOnCooldown)
      handleDisplayCooldowns("dash", habilitySpec.dash.coolDown);
  }, [dashOnCooldown]);

  //Comunication with other components
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

  //handle hits and death
  useEffect(() => {
    if (!state.invulnerability && gameIsRunning) {
      dispatch({ type: ACTIONS.TAKE_DAMAGE });
      handleHeroIsHitAnimation();

      //react reads the previous render, the real/next render for this value would be 0
      if (state.liveCount === 1) {
        handleSetFinalScore(state.coinCount);
        dispatch({ type: ACTIONS.RESET });
        handleResetMovement();
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
    if (moveLeft && !moveRight) {
      setFaceDirection(false);
    } else if (moveRight && !moveLeft) {
      setFaceDirection(true);
    }
  }, [moveRight, moveLeft]);

  //Sound Effects
  const [takeDamageSFX] = useSound(takeDamageSFXFile, { volume: 0.5 });
  const [colectCoinSFX] = useSound(colectCoinSFXFile, { volume: 0.5 });
  const [deathSFX] = useSound(deathSFXFile, { volume: 0.5 });
  const [dashSFX] = useSound(dashSFXFile, { volume: 0.5 });
  const [habilityUpSFX] = useSound(habilityUpSFXFile, { volume: 0.5 });

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
