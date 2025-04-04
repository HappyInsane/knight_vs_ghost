import { useEffect, useState, useRef } from "react";
import "./GameGrid.css";
import backgroundImage from "../../images/background.jpg";
import Hero from "../Hero/Hero.jsx";
import Coin from "../Coin/Coin";
import Enemy from "../Enemy/Enemy";
import StartGameCover from "../StartGameCover/StartGameCover";
import RestartGameCover from "../RestartGameCover/RestartGameCover";
import PauseGameCover from "../PauseGameCover/PauseGameCover";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import AudioButton from "../AudioButton/AudioButton";
import SoundEffectsButton from "../SoundEffectsButton/SoundEffectsButton";
import RestartSoundEffectPlayer from "../RestartSoundEffectPlayer/RestartSoundEffectPlayer";
import CooldownSection from "../CooldownSection/CooldownSection.jsx";

export const gameGrid = {
  height: 560,
  width: 560,
};

export const GAME_STATE = {
  START: "start",
  RUNNING: "running",
  RESTART: "restart",
  PAUSED: "paused",
};

export const EVENT = {
  DEATH: "death",
  HIT: "hit",
  COLECT_COIN: "colect-coin",
};

function GameGrid({ handleDisplayStats }) {
  const [userInput, setUserInput] = useState({ value: "", pressed: false });
  const [heroRerenderNotification, setHeroRerenderNotification] =
    useState(false);
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
    if (
      input.value === "Escape" &&
      input.pressed &&
      gameState === GAME_STATE.RUNNING
    ) {
      setGameState(GAME_STATE.PAUSED);
    } else {
      setUserInput({ value: input.value, pressed: input.pressed });
      setHeroRerenderNotification(!heroRerenderNotification);
    }
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
    if (coinCount % 10 === 0 || coinCount === 1) {
      setThresholdArray([...thresholdArray, coinCount]);
    }
  }, [coinCount]);

  //game state manager
  const [gameState, setGameState] = useState(GAME_STATE.START);

  //Game state hooks
  const gameGridRef = useRef(null);
  const startCoverRef = useRef(null);
  const restartCoverRef = useRef(null);
  const pauseCoverRef = useRef(null);

  useEffect(() => {
    if (gameState === GAME_STATE.START && startCoverRef.current) {
      startCoverRef.current.focus();
    } else if (gameState === GAME_STATE.RUNNING && gameGridRef.current) {
      gameGridRef.current.focus();
    } else if (gameState === GAME_STATE.RESTART && restartCoverRef.current) {
      restartCoverRef.current.focus();
    } else if (gameState === GAME_STATE.PAUSED && pauseCoverRef.current) {
      pauseCoverRef.current.focus();
    }
  }, [gameState]);

  //Restart-game-cover handlers
  const [finalScore, setFinalScore] = useState(0);

  const handleSetFinalScore = (score) => {
    setFinalScore(score);
    setGameState(GAME_STATE.RESTART);

    setThresholdArray([]);
    setCoinCount(0);
  };

  //cooldowns
  const [cooldownNotificationList, setCooldownNotificationList] = useState({
    dash: null,
  });
  const handleDisplayCooldowns = (cooldownName, value) => {
    setCooldownNotificationList((cooldownNotificationList) => {
      return { ...cooldownNotificationList, [cooldownName]: value };
    });
  };

  //sound hooks
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(true);

  const [musicLoaded, setMusicLoaded] = useState(false);
  const handleMusicLoaded = () => {
    setMusicLoaded(true);
  };

  return (
    <div>
      {/*Game Music and SFX */}
      <SoundEffectsButton
        soundEffectsEnabled={soundEffectsEnabled}
        toggleSoundEffects={() => {
          setSoundEffectsEnabled(!soundEffectsEnabled);
        }}
        onKeyDown={() => {
          if (gameState === GAME_STATE.RUNNING) gameGridRef.current.focus();
        }}
      />
      <AudioButton
        musicEnabled={musicEnabled}
        musicLoaded={musicLoaded}
        toggleMusic={() => {
          setMusicEnabled(!musicEnabled);
        }}
        onKeyDown={() => {
          if (gameState === GAME_STATE.RUNNING) gameGridRef.current.focus();
        }}
      />
      <AudioPlayer
        gameState={gameState}
        musicEnabled={musicEnabled}
        handleMusicLoaded={handleMusicLoaded}
      />
      <RestartSoundEffectPlayer
        soundEffectsEnabled={soundEffectsEnabled}
        gameState={gameState}
      />
      {/*Game State Covers */}
      {gameState === GAME_STATE.START && (
        <StartGameCover
          handleGameStart={() => {
            setGameState(GAME_STATE.RUNNING);
          }}
          ref={startCoverRef}
        />
      )}
      {gameState === GAME_STATE.PAUSED && (
        <PauseGameCover
          handleUnpause={() => {
            setGameState(GAME_STATE.RUNNING);
          }}
          ref={pauseCoverRef}
        />
      )}
      {gameState === GAME_STATE.RESTART && (
        <RestartGameCover
          handleGameStart={() => {
            setGameState(GAME_STATE.RUNNING);
          }}
          handleGameMainMenu={() => {
            setGameState(GAME_STATE.START);
          }}
          scoreDisplayed={finalScore}
          gameState={gameState}
          ref={restartCoverRef}
          soundEffectsEnabled={soundEffectsEnabled}
        />
      )}
      {/*Game Grid*/}
      <div className="game-grid-container">
        <div
          className="game-grid"
          style={{
            height: gameGrid.height,
            width: gameGrid.width,
            backgroundColor: gridAnimation.backgroundColor,
          }}
          onKeyDown={(e) => {
            e.preventDefault();
            handleInput({ value: e.key, pressed: true });
          }}
          onKeyUp={(e) => {
            handleInput({ value: e.key, pressed: false });
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
            rerenderNotification={heroRerenderNotification}
            handleDisplayStats={handleDisplayStats}
            handleNotifyPosition={handleNotifyPosition}
            coinColectionNotification={coinColectionNotification}
            heroIsHitNotification={heroIsHitNotification}
            handleHeroIsHitAnimation={handleHeroIsHitAnimation}
            handleSetFinalScore={handleSetFinalScore}
            gameState={gameState}
            soundEffectsEnabled={soundEffectsEnabled}
            handleDisplayCooldowns={handleDisplayCooldowns}
          />
          <Coin
            heroPosition={heroPosition}
            handleCoinColection={handleCoinColection}
          />
          <Coin
            heroPosition={heroPosition}
            handleCoinColection={handleCoinColection}
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
            if (threshold) {
              return (
                <Enemy
                  enableThreshold={threshold}
                  coinCount={coinCount}
                  heroPosition={heroPosition}
                  handleHeroIsHit={handleHeroIsHit}
                  key={threshold}
                  gameState={gameState}
                />
              );
            }
          })}
        </div>
        <CooldownSection
          cooldownNotificationList={cooldownNotificationList}
          gameState={gameState}
        />
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
