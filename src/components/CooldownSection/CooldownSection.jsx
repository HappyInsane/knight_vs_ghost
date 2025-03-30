import "./CooldownSection.css";
import CooldownDisplay from "../CoolDownDisplay/CooldownDisplay";
import { GAME_STATE } from "../GameGrid/GameGrid";

function CooldownSection({ cooldownNotificationList, gameState }) {
  return (
    <>
      <div
        className="cooldown-section"
        style={{
          opacity:
            gameState === GAME_STATE.RUNNING || gameState === GAME_STATE.PAUSED
              ? 1
              : 0,
        }}
      >
        <div className="cooldown-section-title">COOLDOWNS</div>
        <CooldownDisplay
          name={"dash"}
          cooldownNotificationList={cooldownNotificationList}
        />
      </div>
    </>
  );
}

export default CooldownSection;
