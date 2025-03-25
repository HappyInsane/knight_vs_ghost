import "./Enemy.css";
import enemyImage from "../../images/enemy.gif";
import { useEffect, useState, useReducer } from "react";
import { hero } from "../Hero/Hero";
import { gameGrid, GAME_STATE } from "../GameGrid/GameGrid";
import {
  overlap,
  generateNewCoinCoordenates,
  getRandomIntegerInclusive,
  contain,
} from "../../helpers/interaction";

const ACTIONS = {
  TOGGLE_ENABLE: "toggle-enable",
  MOVE: "move",
};

export const enemy = {
  height: 50,
  width: 50,
  velocity: 30,
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.TOGGLE_ENABLE:
      return { ...state, enable: !state.enable };
    case ACTIONS.MOVE:
      const futurePosition = [
        state.position[0] + enemy.velocity * Math.cos(state.direction),
        state.position[1] + enemy.velocity * Math.sin(state.direction),
      ];
      if (
        !contain(gameGrid, {
          height: enemy.height,
          width: enemy.width,
          position: futurePosition,
        })
      ) {
        return {
          ...state,
          direction: getRandomIntegerInclusive(0, 2 * Math.PI),
        };
      } else {
        return {
          ...state,
          position: futurePosition,
        };
      }
    default:
      return state;
  }
}

function Enemy({
  heroPosition,
  handleHeroIsHit,
  enableThreshold,
  coinCount,
  gameState,
}) {
  const [state, dispatch] = useReducer(reducer, {
    position: generateNewCoinCoordenates(gameGrid, enemy, {
      height: hero.height,
      width: hero.width,
      position: heroPosition,
    }),
    enable: false,
    direction: getRandomIntegerInclusive(0, 2 * Math.PI),
  });

  //Game state aware variable
  const [gameIsRunning, setGameIsRunning] = useState(false);

  useEffect(() => {
    if (gameState === GAME_STATE.RUNNING) {
      setGameIsRunning(true);
    } else {
      setGameIsRunning(false);
    }
  }, [gameState]);

  useEffect(() => {
    if (coinCount === enableThreshold) {
      dispatch({ type: ACTIONS.TOGGLE_ENABLE });
    }
  }, [coinCount]);

  //movement speed controls
  const [rerender, setRerender] = useState(false);

  useEffect(() => {
    if (state.enable && gameIsRunning) {
      dispatch({ type: ACTIONS.MOVE });
      setTimeout(() => setRerender(!rerender), 500 - coinCount * 5);
    }
  }, [state.enable, rerender]);

  useEffect(() => {
    if (
      state.enable &&
      overlap(
        { height: hero.height, width: hero.width, position: heroPosition },
        { height: enemy.height, width: enemy.width, position: state.position }
      )
    ) {
      handleHeroIsHit();
    }
  }, [heroPosition, state.position]);

  //enemy facing direction
  const [faceDirection, setFaceDirection] = useState(true);

  useEffect(() => {
    if (state.direction < (3 * Math.PI) / 2 && state.direction > Math.PI / 2) {
      setFaceDirection(false);
    } else {
      setFaceDirection(true);
    }
  }, [state.direction]);

  return (
    <>
      <div
        className="enemy"
        style={{
          top: state.position[1],
          left: state.position[0],
          height: enemy.height,
          width: enemy.width,
        }}
      >
        <img
          className="enemy-image"
          src={enemyImage}
          style={{
            height: "160%",
            opacity: state.enable ? 1 : 0,
            transform: faceDirection ? "scaleX(1)" : "scaleX(-1)",
          }}
        />
      </div>
    </>
  );
}

export default Enemy;
