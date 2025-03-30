import "./LeaderBoardCover.css";
import { gameGrid } from "../GameGrid/GameGrid";
import leaderboardJSON from "../../testDataBase/leaderboard.json";

function LeaderBoardCover({ handleLeaderBoardCoverClose }) {
  const leaderboardString = JSON.stringify(leaderboardJSON);
  const leaderboard = JSON.parse(leaderboardString);
  return (
    <div
      className="leader-board-game-cover"
      style={{ width: gameGrid.width, height: gameGrid.height }}
    >
      <div className="header">
        LEADERBOARD
        <button
          className="close-button"
          onClick={() => {
            handleLeaderBoardCoverClose();
          }}
        >
          X
        </button>
      </div>
      <div className="leader-board">
        {leaderboard.map((user, index) => {
          return (
            <div
              className="leader-board-user"
              key={index}
              style={{
                borderColor:
                  index + 1 === 1
                    ? "rgb(255, 230, 0)"
                    : index + 1 === 2
                    ? "rgb(190, 255, 246)"
                    : index + 1 === 3
                    ? "rgb(179, 42, 0)"
                    : "lightgray",
                color:
                  index + 1 === 1
                    ? "rgb(255, 230, 0)"
                    : index + 1 === 2
                    ? "rgb(190, 255, 246)"
                    : index + 1 === 3
                    ? "rgb(179, 42, 0)"
                    : "lightgray",
                opacity: 1 - (index + 1) / 50,
              }}
            >
              <div
                className="placement-number-container"
                style={{
                  padding: "0px 30px",
                  fontWeight: "700",
                }}
              >
                <div
                  style={{
                    fontSize: "40px",
                  }}
                >
                  {index + 1}
                </div>
                {index + 1 === 1 && <div>st</div>}
                {index + 1 === 2 && <div>nd</div>}
                {index + 1 === 3 && <div>rd</div>}
                {index + 1 > 3 && <div>th</div>}
              </div>

              <div style={{ width: "60%" }}>{user.name.toUpperCase()}</div>
              <div
                style={{ width: "40%", fontWeight: "500" }}
              >{`${user.value}pts`}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LeaderBoardCover;
