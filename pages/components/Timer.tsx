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
  
  // Initialize with null to avoid hydration mismatch
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
    // Set isClient to true and calculate initial time on client
    setIsClient(true);
    setTimeLeft(calculateTimeLeft());

    // Set up the interval
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  // Show loading state until client-side hydration is complete
  if (!isClient) {
    return <div>Loading timer...</div>;
  }

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
                  className={styles.timerDigit}
                >
                  {timeLeft.days.toString().padStart(3, '0')}
                </Subtitle2>
              </Card>
              <Body1 className={styles.timerValueLabel}>Days</Body1>
            </div>
            <div className={styles.timerSubContainer}>
              <Card className={styles.timerValue}>
                <Subtitle2
                  className={styles.timerDigit}
                >
                  {timeLeft.hours.toString().padStart(2, '0')}
                </Subtitle2>
              </Card>
              <Body1 className={styles.timerValueLabel}>Hours</Body1>
            </div>
            <div className={styles.timerSubContainer}>
              <Card className={styles.timerValue}>
                <Subtitle2
                  className={styles.timerDigit}
                >
                  {timeLeft.minutes.toString().padStart(2, '0')}
                </Subtitle2>
              </Card>
              <Body1 className={styles.timerValueLabel}>Minutes</Body1>
            </div>
            <div className={styles.timerSubContainer}>
              <Card className={styles.timerValue}>
                <Subtitle2
                  className={styles.timerDigit}
                >
                  {timeLeft.seconds.toString().padStart(2, '0')}
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
