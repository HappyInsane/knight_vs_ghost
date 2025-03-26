import "./LiveCounter.css";
import heartImage from "../../images/heart.gif";
import deathImage from "../../images/skull-laugh.gif";

function LiveCounter({ liveCountDisplayed }) {
  return (
    <div className="lives-stat-container">
      <div className="lives-stat">Lives</div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: liveCountDisplayed > 0 ? "space-between" : "center",
          width: 150,
          padding: "0px 10px 10px 0px",
        }}
        onChange={() => console.log("si")}
      >
        {liveCountDisplayed > 0 ? (
          <>
            <img
              src={heartImage}
              style={{
                height: "45px",
                opacity: liveCountDisplayed >= 1 ? 1 : 0.5,
              }}
            />
            <img
              src={heartImage}
              style={{
                height: "45px",
                opacity: liveCountDisplayed >= 2 ? 1 : 0.5,
              }}
            />
            <img
              src={heartImage}
              style={{
                height: "45px",
                opacity: liveCountDisplayed >= 3 ? 1 : 0.5,
              }}
            />
          </>
        ) : (
          <img src={deathImage} style={{ height: "90px" }} />
        )}
      </div>
    </div>
  );
}

export default LiveCounter;
