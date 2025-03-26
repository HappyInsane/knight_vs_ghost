import React from "react";
import "./CoinCounter.css";
import coinImage from "../../images/coin.gif";
import { useEffect, useState, useRef } from "react";

function CoinCounter({ coinCountDisplayed }) {
  const [coinLogoHeight, setCoinLogoHeight] = useState(45);

  useEffect(() => {
    setCoinLogoHeight(70);
    setTimeout(() => setCoinLogoHeight(45), 400);
  }, [coinCountDisplayed]);

  return (
    <div className="coins-stat-container">
      <div className="coins-stat">Coins</div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          padding: "0px 10px 10px 0px",
        }}
      >
        <div className="coins-stat">{coinCountDisplayed}</div>
        <img
          className="coin-image"
          src={coinImage}
          style={{ height: coinLogoHeight }}
        />
      </div>
    </div>
  );
}

export default CoinCounter;
