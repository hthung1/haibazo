/* eslint-disable import/no-unresolved */
/* eslint-disable no-undef */
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";

const getRandomPosition = (maxWidth, maxHeight) => {
  const x = Math.floor(Math.random() * (maxWidth - 50));
  const y = Math.floor(Math.random() * (maxHeight - 50));
  return { x, y };
};

export default function Home() {
  const [number, setNumber] = useState(5);
  const [circles, setCircles] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [counting, setCounting] = useState(null);
  const [lastSelected, setLastSelected] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [statusGame, setStatusGame] = useState(0);

  const playGame = () => {
    setGameStarted(true);
    restartGame();
  };

  const restartGame = () => {
    const newCircles = [];
    const maxWidth = 500;
    const maxHeight = 500;

    for (let i = 1; i <= number; i++) {
      const { x, y } = getRandomPosition(maxWidth, maxHeight);
      newCircles.push({ id: i, x, y, opacity: 1, time: 3, fading: false });
    }
    setStatusGame(0);
    setCircles(newCircles);
    setTimer(0);
    setCounting(true);
    setLastSelected(0);
  };

  const handleClickCircle = (id) => {
    if (id !== lastSelected + 1) {
      setCounting(false);
      setStatusGame(2);
      return;
    }

    setCircles((prevCircles) =>
      prevCircles.map((circle) =>
        circle.id === id
          ? { ...circle, opacity: 1, fading: true, time: 3 }
          : circle
      )
    );

    setLastSelected(id);
  };

  const toggleAutoPlay = () => {
    setAutoPlay((prev) => !prev);
  };

  const renderStatus = (status) => {
    switch (status) {
      case 0:
        return <h3 className={styles.header0}>let&apos;s play</h3>;
      case 1:
        return <h3 className={styles.header1}>all cleared</h3>;
      case 2:
        return <h3 className={styles.header2}>game over</h3>;
      default:
        return 0;
    }
  };

  useEffect(() => {
    if (!counting) return;
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 0.1);
      setCircles((prevCircles) =>
        prevCircles.map((circle) =>
          circle.fading && circle.time > 0
            ? { ...circle, time: Number(circle.time - 0.1).toFixed(1), opacity: (circle.opacity - 0.0333) }
            : circle
        )
      );
      if (circles[number - 1]?.time === "0.0") {
        setCounting(false);
        setStatusGame(1);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [circles, counting]);

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      if (lastSelected < number) {
        handleClickCircle(lastSelected + 1);
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [autoPlay, lastSelected, number]);


  return (
    <div className={styles.container}>
      {renderStatus(statusGame)}
      <div className={styles.form}>
        <div className={styles.formItem}>
          <label>Points:</label>
          <input
            className={styles.input}
            type="number"
            value={number}
            onChange={(e) => {
              const newValue = Number(e.target.value);
              if (newValue > 0) {
                setNumber(newValue);
              }
            }}
            disabled={gameStarted}
          />
        </div>
        <div className={styles.timer}>
          <span>Time:</span>
          <span>{timer.toFixed(1)}s</span>
        </div>
      </div>

      {gameStarted ? (
        <div>
          <button onClick={restartGame} className={styles.button}>
            Restart
          </button>
          {
            statusGame === 0 && <button
              onClick={toggleAutoPlay}
              className={styles.button}
            >
              {autoPlay ? "Auto Play ON" : "Auto Play OFF"}
            </button>
          }
        </div>
      ) : (
        <button onClick={playGame} className={styles.button}>
          Play
        </button>
      )}

      <div className={styles.gameBoard} style={{
        pointerEvents: !counting && "none"
      }}>
        {circles.map((circle) => (
          <div
            key={circle.id}
            onClick={() => handleClickCircle(circle.id)}
            className={styles.circle}
            style={{
              left: circle.x,
              top: circle.y,
              opacity: circle.opacity,
            }}
          >
            <span>{circle.id}</span>
            <span className={styles.circleText}>
              {circle.fading && `${circle.time}s`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
