import { Body1, Link, makeStyles } from "@fluentui/react-components";

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
  textDecoration: "underline",
  textUnderlineOffset: "2px",
  },
});

type BannerMessageProps = {
  text: string;
  language?: "EN" | "ES";
};

const BannerSubmessageLink = ({ text }: BannerMessageProps) => {
  const styles = useStyles();
  const href = `/hotels`;

  return (
    <>
      <div className={styles.mainContainer}>
        <Link href={href} appearance="subtle" className={styles.sophisticatedText}>
          {text}
        </Link>
      </div>
    </>
  );
};

export default BannerSubmessageLink;
