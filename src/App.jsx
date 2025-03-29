import { useState } from "react";
import "./App.css";
import GameGrid from "./components/GameGrid/GameGrid";
import CoinCounter from "./components/CoinCounter/CoinCounter";
import LiveCounter from "./components/LiveCounter/LiveCounter";
import HighScore from "./components/HighScore/HighScore";
import arrowsImage from "./images/arrows.png";

function App() {
  const [liveCount, setLiveCount] = useState(3);
  const [coinCount, setCoinCount] = useState(0);
  const handleDisplayStats = (liveCount, coinCount) => {
    setLiveCount(liveCount);
    setCoinCount(coinCount);
  };

  return (
    <>
      <div className="game-container">
        <div className="stat-container">
          <CoinCounter coinCountDisplayed={coinCount} />
          <LiveCounter liveCountDisplayed={liveCount} />
          <HighScore coinCount={coinCount} />
        </div>
        <GameGrid handleDisplayStats={handleDisplayStats} />
      </div>
    </>
  );
}

export default App;
