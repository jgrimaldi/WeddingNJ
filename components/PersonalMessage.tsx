import { Body1, makeStyles } from "@fluentui/react-components";

const useStyles = makeStyles({
  mainContainer: {
    display: "flex",
    paddingTop: "4em",
    flexDirection: "column",
    maxWidth: "80vw",
  },
  sophisticatedText: {
    fontFamily: "Segoe UI Light",
    fontSize: "1.2em",
    textAlign: "center",
    lineHeight: "1.3em",
  },
});

type PersonalMessageProps = {
  customMessage?: string;
};

const PersonalMessage = ({ customMessage = "Welcome to our wedding portal!" }: PersonalMessageProps) => {
  const styles = useStyles();

  return (
    <>
      <div className={styles.mainContainer}>
        <Body1 className={styles.sophisticatedText}>{customMessage}</Body1>
      </div>
    </>
  );
};

export default PersonalMessage;
