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
import { useEffect, useState } from "react";


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
  timerContainer:{
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
  },
  timerValue: {
    padding: "0.5em",
    width: "3em",
    alignItems: "center",
  },
  timerTitle: {
    fontFamily: "Segoe UI Light",
    color: "#3D3D3D",
  },
});

const Timer: React.FC<TimerProps> = ({ targetDate }) => {
  const styles = useStyles();
  const calculateTimeLeft = (): TimeLeft | null => {
    const difference = +new Date(targetDate) - +new Date();
    if (difference < 0) { return null; }
    
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };

  };

  
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
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
              <Subtitle2 color="#3D3D3D">{timeLeft.days}</Subtitle2>              
              </Card>
              <Body1 color="#3D3D3D">Days</Body1>
            </div>
            <div className={styles.timerSubContainer}>
              <Card className={styles.timerValue}>
              <Subtitle2>{timeLeft.hours}</Subtitle2>              
              </Card>
              <Body1>Hours</Body1>
            </div>
            <div className={styles.timerSubContainer}>
              <Card className={styles.timerValue}>
              <Subtitle2>{timeLeft.seconds}</Subtitle2>              
              </Card>
              <Body1>Seconds</Body1>
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
