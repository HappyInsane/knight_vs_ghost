import "./HighScore.css";
import { useState, useEffect } from "react";
import highScoreImage from "../../images/trophy.gif";
import { getDocument, db } from "../../config/firebase.js";
import { doc, updateDoc } from "firebase/firestore";

function HighScore({ coinCount }) {
  /*
  //reset local storage
    useEffect(() => {
    localStorage.setItem(
      "highScore",
      JSON.stringify({ value: 0, uploaded: false })
    );
  }, []);
  */

  //initialize local HS
  const [highScore, setHighScore] = useState(() => {
    const res = localStorage.getItem("highScore");
    if (res) {
      return JSON.parse(res);
    } else return { value: 0, uploaded: false };
  });

  //Upload menu
  const [uploadButtonVisibility, setUploadButtonVisibility] = useState(false);
  const [uploadMenuVisibility, setUploadMenuVisibility] = useState(false);
  const [username, setUsername] = useState("");

  //update local HS
  useEffect(() => {
    if (coinCount > highScore.value) {
      setHighScore({ value: coinCount, uploaded: false });
      localStorage.setItem(
        "highScore",
        JSON.stringify({ value: coinCount, uploaded: false })
      );
    }
  }, [coinCount]);

  //initialize remote HS
  const [firebaseLeaderboardData, setFirebaseLeaderboardData] = useState(null);

  useEffect(() => {
    getDocument("leaderboard", "6AppVKwaOBlCTTXAEoij").then((data) => {
      if (data) {
        setFirebaseLeaderboardData(data);
      }
    });
  }, [highScore]);

  //update remote HS
  const handleHighScoreUpload = async (username) => {
    if (!firebaseLeaderboardData) {
      console.error("Leaderboard data not available.");
      return;
    }

    const leaderboard = [...firebaseLeaderboardData]; // Create a copy
    leaderboard.push({ name: username, value: highScore.value }); // Add new score

    leaderboard.sort((a, b) => b.value - a.value); // Sort descending

    if (leaderboard.length > 30) {
      leaderboard.pop(); // Remove the lowest score if more than 30
    }

    const isTop30 = leaderboard.some(
      (entry) => entry.value === highScore.value
    );

    if (isTop30) {
      try {
        const leaderboardRef = doc(db, "leaderboard", "6AppVKwaOBlCTTXAEoij");
        await updateDoc(leaderboardRef, {
          JSON_string: JSON.stringify(leaderboard),
        });

        setHighScore({ value: highScore.value, uploaded: true });
        localStorage.setItem(
          "highScore",
          JSON.stringify({ value: highScore.value, uploaded: true })
        );
      } catch (error) {
        console.error("Error updating leaderboard:", error);
      }
    } else {
      console.log("Score not in top 30.");
    }
  };

  useEffect(() => {
    if (!highScore.uploaded) {
      setUploadButtonVisibility(true);
    }
  }, [highScore]);

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
        <div className="high-score-stat">{highScore.value}</div>
        <img
          className="high-score-image"
          src={highScoreImage}
          style={{ height: 50 }}
        />
      </div>

      {uploadButtonVisibility && (
        <button
          className="upload-high-score-button"
          onClick={() => {
            setUploadMenuVisibility(true);
            setUploadButtonVisibility(false);
          }}
        >
          Upload NEW HS
        </button>
      )}

      {uploadMenuVisibility && (
        <div className="upload-menu">
          <div style={{ color: "rgb(0, 192, 0)" }}>Upload Score</div>
          <button
            className="close-upload-menu-button"
            onClick={() => {
              setUploadButtonVisibility(true);
              setUploadMenuVisibility(false);
            }}
          >
            X
          </button>
          <input
            className="name-input"
            type="text"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            maxLength={5}
            placeholder="Username"
          />
          <div
            style={{
              color: username.length === 5 ? "rgb(0, 192, 0)" : "green",
            }}
            className="character-counter"
          >{`${username.length}/5`}</div>
          <button
            className="upload-button"
            disabled={!username ? true : false}
            onClick={() => {
              handleHighScoreUpload(username);
              setUploadMenuVisibility(false);
            }}
            style={{
              opacity: !username ? 0.3 : 1,
              pointerEvents: !username ? "none" : "all",
            }}
          >
            Upload
          </button>
        </div>
      )}
    </div>
  );
}

export default HighScore;
