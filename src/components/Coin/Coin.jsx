import "./Coin.css";
import coinImage from "../../images/coin.gif";
import { useEffect, useReducer, useState } from "react";
import { gameGrid } from "../GameGrid/GameGrid";
import { hero } from "../Hero/Hero.jsx";
import {
  overlap,
  generateNewCoinCoordenates,
} from "../../helpers/interaction.js";

const ACTIONS = {
  COLECT: "colect",
  REPOSITION: "reposition",
};

export const coin = {
  height: 45,
  width: 45,
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.COLECT:
      return { ...state, colected: !state.colected };
    case ACTIONS.REPOSITION:
      return {
        ...state,
        position: generateNewCoinCoordenates(gameGrid, coin, {
          height: hero.height * 10,
          width: hero.width * 10,
          position: action.payload.heroPosition,
        }),
      };
    default:
      return state;
  }
}

function Coin({ heroPosition, handleCoinColection }) {
  const [state, dispatch] = useReducer(reducer, {
    position: generateNewCoinCoordenates(gameGrid, coin, {
      height: hero.height,
      width: hero.width,
      position: heroPosition,
    }),
    colected: false,
  });

  useEffect(() => {
    if (!state.colected) {
      if (
        overlap(
          { height: hero.height, width: hero.width, position: heroPosition },
          { height: coin.height, width: coin.width, position: state.position }
        )
      ) {
        handleCoinAnimation();
        handleCoinColection();
        dispatch({ type: ACTIONS.COLECT });
        setTimeout(() => {
          dispatch({
            type: ACTIONS.REPOSITION,
            payload: { heroPosition: heroPosition },
          });
        }, 1000);
        setTimeout(() => {
          dispatch({ type: ACTIONS.COLECT });
        }, 2000);
      }
    }
  }, [heroPosition, state.position]);

  //animation management

  const [coinAnimation, setCoinAnimation] = useState({
    top: 5,
    opacity: 1,
  });

  const handleCoinAnimation = () => {
    setCoinAnimation({ top: -20, opacity: 0 });
    setTimeout(() => {
      setCoinAnimation({ top: 5, opacity: 1 });
    }, 1800);
  };

  return (
    <>
      <div
        className="coin"
        style={{
          height: coin.height,
          width: coin.width,
          top: state.position[1],
          left: state.position[0],
        }}
      >
        <img
          src={coinImage}
          style={{
            position: "absolute",
            top: coinAnimation.top,
            height: "80%",
            opacity: coinAnimation.opacity,
            transition: state.colected
              ? "top 0.5s, left 0.5s, opacity 0.5s"
              : "opacity 0.2s",
          }}
        />
      </div>
    </>
  );
}

export default Coin;
