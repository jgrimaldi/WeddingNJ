import { makeStyles, Subtitle2, Body1 } from "@fluentui/react-components";
import { useEffect, useState } from "react";

type TimerProps = {
  targetDate: Date;
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
    paddingTop: "4em",
  },
  timerSubContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: "0.5em",
  },
  timerDigit: {
    transition: "transform 0.5s ease-in-out",
    opacity: "0.5s ease-in-out",
    fontFamily: `'Playfair Display', serif`,
    fontSize: '2em',
    color: "#3D3D3D",
  },
  timerValueLabel: {
    fontFamily: `'Playfair Display', serif`,
    color: "#3D3D3D",
    textTransform: 'uppercase'
  },
});

const Timer: React.FC<TimerProps> = ({ targetDate }) => {
  const styles = useStyles();
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isClient, setIsClient] = useState(false);

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

  useEffect(() => {
    setIsClient(true);
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!isClient) {
    return <div>Loading timer...</div>;
  }

  return (
    <>
      {timeLeft ? (
        <div className={styles.timerContainer}>
          <div className={styles.timerSubContainer}>
            <Subtitle2 color="#3D3D3D" className={styles.timerDigit}>
              {timeLeft.days.toString().padStart(3, "0")}
            </Subtitle2>
            <Body1 className={styles.timerValueLabel}>Days</Body1>
          </div>
          <div className={styles.timerSubContainer}>
            <Subtitle2 className={styles.timerDigit}>
              {timeLeft.hours.toString().padStart(2, "0")}
            </Subtitle2>
            <Body1 className={styles.timerValueLabel}>Hours</Body1>
          </div>
          <div className={styles.timerSubContainer}>
            <Subtitle2 className={styles.timerDigit}>
              {timeLeft.minutes.toString().padStart(2, "0")}
            </Subtitle2>
            <Body1 className={styles.timerValueLabel}>Minutes</Body1>
          </div>
          <div className={styles.timerSubContainer}>
            <Subtitle2 className={styles.timerDigit}>
              {timeLeft.seconds.toString().padStart(2, "0")}
            </Subtitle2>
            <Body1 className={styles.timerValueLabel}>Seconds</Body1>
          </div>
        </div>
      ) : (
        <>Wedding is happening now!</>
      )}
    </>
  );
};

export default Timer;
