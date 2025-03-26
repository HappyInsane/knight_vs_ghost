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
      return { ...state, colected: true };
    case ACTIONS.REPOSITION:
      return {
        ...state,
        position: generateNewCoinCoordenates(gameGrid, coin, {
          height: hero.height * 5,
          width: hero.width * 5,
          position: action.payload.heroPosition,
        }),
        colected: false,
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
        setPrevCoinPosition(state.position);
        handleCoinAnimation();
        handleCoinColection();
        dispatch({ type: ACTIONS.COLECT });
        dispatch({
          type: ACTIONS.REPOSITION,
          payload: { heroPosition: heroPosition },
        });
      }
    }
  }, [heroPosition, state.position]);

  //animation management
  const [prevCoinPosition, setPrevCoinPosition] = useState(state.position);

  const [coinAnimation, setCoinAnimation] = useState({ top: 0, opacity: 1 });

  const handleCoinAnimation = () => {
    setCoinAnimation({ top: 50, opacity: 0 });
    setTimeout(() => {
      setCoinAnimation({ top: 0, opacity: 1 });
    }, 1000);
  };

  useEffect(() => {
    setTimeout(() => {
      setPrevCoinPosition(state.position);
    }, 500);
  }, [state.position]);

  return (
    <>
      <div
        className="coin"
        style={{
          height: coin.height,
          width: coin.width,
          top: state.position[1],
          left: state.position[0],
          opacity: coinAnimation.opacity,
        }}
      >
        <img src={coinImage} style={{ height: "80%" }} />
      </div>

      {/*coin-proxy for animations*/}
      <div
        className="coin"
        style={{
          height: coin.height,
          width: coin.width,
          top: prevCoinPosition[1] - coinAnimation.top,
          left: prevCoinPosition[0],
          opacity: coinAnimation.opacity,
          transition:
            coinAnimation.opacity === 0
              ? "top ease-in 0.15s, left ease-in 0.15s, opacity 0.25s"
              : "none",
        }}
      >
        <img src={coinImage} style={{ height: "80%" }} />
      </div>
    </>
  );
}

export default Coin;
