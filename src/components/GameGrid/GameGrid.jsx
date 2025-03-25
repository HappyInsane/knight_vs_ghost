import { useEffect, useState, useRef } from "react";
import "./GameGrid.css";
import backgroundImage from "../../images/background.jpg";
import Hero from "../Hero/Hero.Jsx";
import Coin from "../Coin/Coin";
import Enemy from "../Enemy/Enemy";
import StartGameCover from "../StartGameCover/StartGameCover";
import RestartGameCover from "../RestartGameCover/RestartGameCover";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import AudioButton from "../AudioButton/AudioButton";

export const gameGrid = {
  height: 560,
  width: 560,
};

export const GAME_STATE = {
  START: "start",
  RUNNING: "running",
  RESTART: "restart",
};

function GameGrid({ handleDisplayStats }) {
  const [userInput, setUserInput] = useState("");
  const [heroRerender, setHeroRerender] = useState(false);
  //to notify the hero he has colected a coin
  const [coinColectionNotification, setCoinColectionNotification] =
    useState(false);
  const [heroIsHitNotification, setHeroIsHitNotification] = useState(false);
  const [gridAnimation, setGridAnimation] = useState({
    opacity: 0.9,
    backgroundColor: "none",
  });

  const [heroPosition, setHeroPosition] = useState([
    (gameGrid.width - 6) / 2,
    (gameGrid.height - 6) / 2,
  ]);

  const handleInput = (input) => {
    setUserInput(input);
    setHeroRerender(!heroRerender);
  };

  const handleNotifyPosition = (position) => {
    setHeroPosition(position);
  };

  //to tell enemies when to speed up and to tell the hero when he colects a coin
  const [coinCount, setCoinCount] = useState(0);

  const handleCoinColection = () => {
    setCoinColectionNotification(!coinColectionNotification);
    setCoinCount(coinCount + 1);
  };

  //tells the hero when he is hit
  const handleHeroIsHit = () => {
    setHeroIsHitNotification(!heroIsHitNotification);
  };

  const handleHeroIsHitAnimation = () => {
    setGridAnimation({ opacity: 0.5, backgroundColor: "red" });
    setTimeout(
      () => setGridAnimation({ opacity: 0.9, backgroundColor: "none" }),
      500
    );
  };

  //spawning enemies
  const [thresholdArray, setThresholdArray] = useState([]);

  useEffect(() => {
    if ((coinCount + 5) % 10 === 0) {
      setThresholdArray([...thresholdArray, coinCount + 5]);
    }
    if (coinCount === 0) {
      setThresholdArray([1]);
    }
  }, [coinCount]);

  //game state manager
  const [gameState, setGameState] = useState(GAME_STATE.START);

  //Game covers
  //Start-game-cover hooks and handlers

  const gameGridRef = useRef(null);

  const handleGameStart = () => {
    setGameState(GAME_STATE.RUNNING);
    gameGridRef.current.focus();
  };

  //Restart-game-cover hooks an handlers
  const [finalScore, setFinalScore] = useState(0);

  const handleSetFinalScore = (score) => {
    setFinalScore(score);
    setGameState(GAME_STATE.RESTART);

    setThresholdArray([]);
    setCoinCount(0);
  };

  //audio management
  const [musicEnabled, setMusicEnabled] = useState(false);

  return (
    <div>
      <AudioButton
        musicEnabled={musicEnabled}
        toggleMusic={() => {
          setMusicEnabled(!musicEnabled);
        }}
        onKeyDown={() => {
          if (gameState === GAME_STATE.RUNNING) gameGridRef.current.focus();
        }}
      />
      <AudioPlayer gameState={gameState} musicEnabled={musicEnabled} />
      {gameState === GAME_STATE.START && (
        <StartGameCover handleGameStart={handleGameStart} />
      )}
      {gameState === GAME_STATE.RESTART && (
        <RestartGameCover
          handleGameStart={handleGameStart}
          scoreDisplayed={finalScore}
        />
      )}
      <div
        className="game-grid"
        style={{
          height: gameGrid.height,
          width: gameGrid.width,
          backgroundColor: gridAnimation.backgroundColor,
        }}
        onKeyDown={(e) => {
          handleInput(e.key);
        }}
        tabIndex={0}
        ref={gameGridRef}
      >
        <img
          className="background-image"
          src={backgroundImage}
          style={{ opacity: gridAnimation.opacity }}
        />
        <Hero
          userInput={userInput}
          rerender={heroRerender}
          handleDisplayStats={handleDisplayStats}
          handleNotifyPosition={handleNotifyPosition}
          coinColectionNotification={coinColectionNotification}
          heroIsHitNotification={heroIsHitNotification}
          handleHeroIsHitAnimation={handleHeroIsHitAnimation}
          handleSetFinalScore={handleSetFinalScore}
          gameState={gameState}
        />
        <Coin
          heroPosition={heroPosition}
          handleCoinColection={handleCoinColection}
        />
        <Coin
          heroPosition={heroPosition}
          handleCoinColection={handleCoinColection}
        />
        {thresholdArray.map((threshold) => {
          return (
            <Enemy
              enableThreshold={threshold}
              coinCount={coinCount}
              heroPosition={heroPosition}
              handleHeroIsHit={handleHeroIsHit}
              key={threshold}
            />
          );
        })}
      </div>
      <br />
      <div className="author-info">
        <div>Created by Diego Garcia</div>
        <div>diego.frnz.2004@gmail.com</div>
      </div>
    </div>
  );
}

export default GameGrid;
