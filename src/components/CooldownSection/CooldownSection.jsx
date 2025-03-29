import "./CooldownSection.css";
import CooldownDisplay from "../CoolDownDisplay/CooldownDisplay";

function CooldownSection({ cooldownNotificationList }) {
  return (
    <>
      <div className="cooldown-section">
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
