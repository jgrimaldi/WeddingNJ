import {
  Caption1,
  Divider,
  LargeTitle,
  makeStyles,
  Subtitle1,
  Title1,
  Title2,
  Title3,
} from "@fluentui/react-components";

const useStyles = makeStyles({
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    fontFamily: "Segoe UI Light",
    color: "#3D3D3D",
    gap: "2em",
    padding: "2em"
  },
  titleContainer: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
  },
  timelineItemContainer: {
    display: "flex",
    alignSelf: "flex-start",
    gap: "1em",
  },
  timelineItemColumn: {
    display: "flex",
    flexDirection: "column",
  },
  divider: {
    '&::before': {
      borderRightColor: "#8A8A8A",
    }, 
    '&::after': {
      borderRightColor: "#8A8A8A",
    },    
  },
});

const Timeline = () => {
  const styles = useStyles();

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.titleContainer}>
          <LargeTitle>Wedding Day</LargeTitle>
          <Subtitle1>Sat Feb 28</Subtitle1>
        </div>
        {/*First Timeline Item*/}
        <div className={styles.timelineItemContainer}>
          <Divider
            vertical
            alignContent="start"
            className={styles.divider}
          >
            01
          </Divider>
          <div className={styles.timelineItemColumn}>
            <Caption1>Ceremony</Caption1>
            <Title2>Catholic Mass</Title2>
            <Caption1>Iglesia La Trinidad, Alajuela</Caption1>
            <Caption1>Saturday, February 28, 1:30PM - 4:00PM</Caption1>
            <Caption1>Formal Attire</Caption1>
            <Caption1>Our intimate ceremony in the town where the bride grew up in.</Caption1>
          </div>
        </div>
        {/*Second Timeline Item */}
        <div className={styles.timelineItemContainer}>
          <Divider
            vertical
            alignContent="start"
            className={styles.divider}
          >
            02
          </Divider>
          <div className={styles.timelineItemColumn}>
            <Caption1>Cocktail, Dinner & Dance</Caption1>
            <Title2>Reception</Title2>
            <Caption1>Santa Ana Country Club, Santa Ana</Caption1>
            <Caption1>Saturday, February 28, 5:30PM - 12:00AM</Caption1>
            <Caption1>Formal Attire</Caption1>
            <Caption1>Dinner, dancing and celebration for everyone to enjoy.</Caption1>
          </div>
        </div>
      </div>
    </>
  );
};

export default Timeline;
