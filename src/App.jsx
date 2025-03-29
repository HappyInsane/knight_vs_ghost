import { useState } from "react";
import "./App.css";
import GameGrid from "./components/GameGrid/GameGrid";
import CoinCounter from "./components/CoinCounter/CoinCounter";
import LiveCounter from "./components/LiveCounter/LiveCounter";
import HighScore from "./components/HighScore/HighScore";
import CooldownSection from "./components/CooldownSection/CooldownSection";

function App() {
  const [liveCount, setLiveCount] = useState(3);
  const [coinCount, setCoinCount] = useState(0);
  const handleDisplayStats = (liveCount, coinCount) => {
    setLiveCount(liveCount);
    setCoinCount(coinCount);
  };
  const [cooldownNotificationList, setCooldownNotificationList] = useState({
    dash: null,
  });
  const handleDisplayCooldowns = (cooldownName, value) => {
    setCooldownNotificationList((cooldownNotificationList) => {
      return { ...cooldownNotificationList, [cooldownName]: value };
    });
  };

  return (
    <>
      <div className="game-container">
        <div className="stat-container">
          <CoinCounter coinCountDisplayed={coinCount} />
          <LiveCounter liveCountDisplayed={liveCount} />
          <HighScore coinCount={coinCount} />
        </div>
        <GameGrid
          handleDisplayStats={handleDisplayStats}
          handleDisplayCooldowns={handleDisplayCooldowns}
        />
        <CooldownSection cooldownNotificationList={cooldownNotificationList} />
      </div>
    </>
  );
}

export default App;
