import "./CooldownDisplay.css";
import { useEffect, useState } from "react";

function CooldownDisplay({ name, cooldownNotificationList }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, cooldownNotificationList[name]);
  }, [cooldownNotificationList]);

  return (
    <>
      <div className="cooldown-display">
        <div>{name.toUpperCase()}</div>
        <div
          className="loading-bar"
          style={{
            background: loading
              ? "#000000"
              : "linear-gradient(to right, #4caf50, #8bc34a)",
          }}
        >
          <div
            className="loading"
            style={{
              width: loading ? "100%" : "0%",
              transition: !loading
                ? null
                : `width ${cooldownNotificationList[name] / 1000}s linear`,
            }}
          ></div>
        </div>
      </div>
    </>
  );
}

export default CooldownDisplay;
