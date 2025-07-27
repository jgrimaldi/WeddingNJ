import {
  makeStyles,
  Image,
  Card,
  Title2,
  Subtitle2Stronger,
  Subtitle2,
  Body2,
  Body1,
  LargeTitle,
  Title1,
} from "@fluentui/react-components";
import { useEffect, useRef, useState } from "react";

type TimerProps = {
  targetDate: Date; // ISO format date string
};

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const useStyles = makeStyles({
  timerContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1em",
    padding: "1em",
  },
  timerSubContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: "0.5em"
  },
  timerValue: {
    padding: "0.5em",
    width: "3em",
    alignItems: "center",
  },
  timerDigit: {
    transition: 'transform 0.5s ease-in-out', 
    opacity: '0.5s ease-in-out',
  },
  digitAnimate: {
    transform: 'rotateX(360deg)',
  },
  timerTitle: {
    fontFamily: "Segoe UI Light",
    color: "#3D3D3D",
    marginTop: "0.5em"
  },
  timerValueLabel: {
    fontFamily: "Segoe UI Light",
    color: "#3D3D3D",
  }
});

const Timer: React.FC<TimerProps> = ({ targetDate }) => {
  const styles = useStyles();
  const calculateTimeLeft = (): TimeLeft | null => {
    const difference = +new Date(targetDate) - +new Date();
    if (difference < 0) {
      return null;
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(
    calculateTimeLeft()
  );
  const prevTimeRef = useRef(timeLeft);

  useEffect(() => {
    const timer = setTimeout(() => {
      prevTimeRef.current = timeLeft;
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <>
      {timeLeft ? (
        <>
          <Title1 className={styles.timerTitle}>It's happening !</Title1>
          <div className={styles.timerContainer}>
            <div className={styles.timerSubContainer}>
              <Card className={styles.timerValue}>
                <Subtitle2
                  color="#3D3D3D"
                  className={`${styles.timerDigit} ${
                    timeLeft.days !== prevTimeRef.current?.days
                  }`}
                >
                  {String(timeLeft.days).padStart(3, '0')}
                </Subtitle2>
              </Card>
              <Body1 className={styles.timerValueLabel}>Days</Body1>
            </div>
            <div className={styles.timerSubContainer}>
              <Card className={styles.timerValue}>
                <Subtitle2
                  className={`${styles.timerDigit} ${
                    timeLeft.hours !== prevTimeRef.current?.hours
                  }`}
                >
                  {String(timeLeft.hours).padStart(2, '0')}
                </Subtitle2>
              </Card>
              <Body1 className={styles.timerValueLabel}>Hours</Body1>
            </div>
            <div className={styles.timerSubContainer}>
              <Card className={styles.timerValue}>
                <Subtitle2
                  className={`${styles.timerDigit} ${
                    timeLeft.minutes !== prevTimeRef.current?.minutes
                  }`}
                >
                  {String(timeLeft.minutes).padStart(2, '0')}
                </Subtitle2>
              </Card>
              <Body1 className={styles.timerValueLabel}>Minutes</Body1>
            </div>
            <div className={styles.timerSubContainer}>
              <Card className={styles.timerValue}>
                <Subtitle2
                  className={`${styles.timerDigit} ${
                    timeLeft.seconds !== prevTimeRef.current?.seconds
                    ? styles.digitAnimate : ''
                  }`}
                >
                  {String(timeLeft.seconds).padStart(2, '0')}
                </Subtitle2>
              </Card>
              <Body1 className={styles.timerValueLabel}>Seconds</Body1>
            </div>
          </div>
        </>
      ) : (
        <>Wedding is happening now!</>
      )}
    </>
  );
};

export default Timer;
