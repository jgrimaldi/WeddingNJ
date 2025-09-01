import { Title3, makeStyles } from "@fluentui/react-components";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "2em",
  },
  mainImage: {
    width: "100%",
    height: "auto",
    filter: "grayscale(100%)",
  },
  topTextWrapper: {
    transform: "translate(2%, 40%)",
    zIndex: 2,
  },
  text: {
    fontFamily: "Playfair Display",
    color: "#3D3D3D",
    fontWeight: 600,
    lineHeight: 1,
    fontSize: "3.5em",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    textAlign: "center",
  },
  bottomTextWrapper: {
    transform: "translate(2%, -40%)",
    zIndex: 2,
  },
});

type BannerSubtitleProps = {
  imageSrc: string;
  topText: string;
  bottomText?: string;
  alt?: string;
};

const BannerSubtitle = ({ imageSrc, topText, bottomText, alt = "" }: BannerSubtitleProps) => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <div className={styles.topTextWrapper}>
        <Title3 className={styles.text}>{topText}</Title3>
      </div>
      <img className={styles.mainImage} src={imageSrc} alt={alt} />
      <div className={styles.bottomTextWrapper}>
        <Title3 className={styles.text}>{bottomText}</Title3>
      </div>
    </div>
  );
};

export default BannerSubtitle;
