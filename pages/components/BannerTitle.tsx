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
    paddingBottom: "2em",
    paddingTop: "4em",
    flexDirection: "column",
  },
  sophisticatedText: {
    fontFamily: "Playfair Display",
    color: "#3D3D3D",
    letterSpacing: "0.1em",
  },
  cursiveText: {
    fontFamily: "Edu NSW ACT Cursive",
    color: "#3D3D3D",
    fontWeight: 400,
    fontSize: "1.25em",
    alignSelf: "flex-end",
    letterSpacing: "0.1em",
  }
});

const BannerTitle = () => {
  const styles = useStyles();

  return (
    <>
      <div className={styles.mainContainer}>
        <Title2 className={styles.sophisticatedText}>Nathy & Jorge</Title2>
        <Title3 className={styles.cursiveText}>the wedding</Title3>
      </div>
    </>
  );
};

export default BannerTitle;
