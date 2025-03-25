import "./HighScore.css";
import { useState, useEffect } from "react";
import highScoreImage from "../../images/trophy.gif";

function HighScore({ coinCount }) {
  const [highScore, setHighScore] = useState(() => {
    const res = localStorage.getItem("highScore");
    if (res) {
      return res;
    } else return 0;
  });
  useEffect(() => {
    if (coinCount > highScore) {
      setHighScore(coinCount);
      localStorage.setItem("highScore", coinCount);
    }
  }, [coinCount]);

  return (
    <div className="high-score-stat-container">
      <div className="high-score-stat">HS</div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          padding: "0px 10px 10px 0px",
        }}
      >
        <div className="high-score-stat">{highScore}</div>
        <img
          className="high-score-image"
          src={highScoreImage}
          style={{ height: 50 }}
        />
      </div>
    </div>
  );
}

export default HighScore;
