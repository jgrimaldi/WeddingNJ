import { Body1, makeStyles } from "@fluentui/react-components";

const useStyles = makeStyles({
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "70vw",
    paddingBottom: "2em",
  },
  sophisticatedText: {
    fontFamily: "Segoe UI Light",
    fontSize: "1.4em",
    textAlign: "center",
    lineHeight: "1.3em",
    fontWeight: 700,
  },
});

type BannerMessageProps = {
  text: string;
};

const BannerSubmessage = ({ text }: BannerMessageProps) => {
  const styles = useStyles();

  return (
    <>
      <div className={styles.mainContainer}>
        <Body1 className={styles.sophisticatedText}>{text}</Body1>
      </div>
    </>
  );
};

export default BannerSubmessage;
