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
  ENABLE: "enable",
  MOVE: "move",
};

export const enemy = {
  height: 40,
  width: 30,
  stepSize: 25,
  refreshRate: 200,
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.ENABLE:
      return { ...state, enable: action.payload.value };
    case ACTIONS.MOVE:
      const futurePosition = [
        state.position[0] + enemy.stepSize * Math.cos(state.direction),
        state.position[1] + enemy.stepSize * Math.sin(state.direction),
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

function Enemy({ heroPosition, handleHeroIsHit, coinCount, gameState }) {
  const [state, dispatch] = useReducer(reducer, {
    position: generateNewCoinCoordenates(gameGrid, enemy, {
      height: hero.height * 5,
      width: hero.width * 5,
      position: heroPosition,
    }),
    enable: false,
    direction: getRandomIntegerInclusive(0, 2 * Math.PI),
  });

  //movement speed controls
  const [rerender, setRerender] = useState(false);

  useEffect(() => {
    if (state.enable && gameState === GAME_STATE.RUNNING) {
      dispatch({ type: ACTIONS.MOVE });
      setTimeout(
        () => setRerender(!rerender),
        enemy.refreshRate - (coinCount * enemy.refreshRate) / 150
      );
    }
  }, [state.enable, rerender, gameState]);

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

  //enemy animation
  const [enemyAnimation, setEnemyAnimation] = useState({ opacity: 0 });

  useEffect(() => {
    setTimeout(() => {
      setEnemyAnimation({ opacity: 1 });
    }, 100);
    setTimeout(() => {
      dispatch({ type: ACTIONS.ENABLE, payload: { value: true } });
    }, 1000);
  }, []);

  return (
    <>
      <div
        className="enemy"
        style={{
          top: state.position[1],
          left: state.position[0],
          height: enemy.height,
          width: enemy.width,
          transition: `
          top ${(enemy.refreshRate - coinCount) / 1000}s, 
          left ${(enemy.refreshRate - coinCount) / 1000}s
          `,
        }}
      >
        <img
          className="enemy-image"
          src={enemyImage}
          style={{
            height: "210%",
            opacity: enemyAnimation.opacity,
            transform: faceDirection ? "scaleX(1)" : "scaleX(-1)",
          }}
        />
      </div>
    </>
  );
}

export default Enemy;
