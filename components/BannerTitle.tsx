import { Title2, Title3, makeStyles } from "@fluentui/react-components";

const useStyles = makeStyles({
  mainContainer: {
    display: "flex",
    paddingTop: "4em",
    flexDirection: "column",
  },
  sophisticatedText: {
    fontFamily: "Playfair Display",
    color: "#3D3D3D",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  cursiveText: {
    fontFamily: "Edu NSW ACT Cursive",
    color: "#3D3D3D",
    fontWeight: 400,
    fontSize: "1.25em",
    alignSelf: "flex-end",
    letterSpacing: "0.1em",
  },
});

type BannerTitleProps = {
  language?: string;
};

const BannerTitle = ({ language = "en" }: BannerTitleProps) => {
  const styles = useStyles();
  let subtitle = "our wedding";
  if (language === "ES") {
    subtitle = "nuestra boda";
  }

  return (
    <>
      <div className={styles.mainContainer}>
        <Title2 className={styles.sophisticatedText}>Nathy & Jorge</Title2>
        <Title3 className={styles.cursiveText}>{subtitle}</Title3>
      </div>
    </>
  );
};

export default BannerTitle;
