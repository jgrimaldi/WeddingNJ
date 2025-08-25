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
    paddingTop: "4em",
    flexDirection: "column",
    maxWidth: "70vw"
  },
  sophisticatedText: {
    fontFamily: "Segoe UI Light",
    color: "#3D3D3D",
    fontSize: "1em",
    textAlign: "center",
    lineHeight: "1.5em"
  },
  cursiveText: {
    fontFamily: "Edu NSW ACT Cursive",
    color: "#3D3D3D",
    fontWeight: 400,
    fontSize: "1.25em",
    alignSelf: "flex-end",
  }
});


type PersonalMessageProps = {
  customMessage: string;
};

const PersonalMessage = ({customMessage} : PersonalMessageProps) => {
  const styles = useStyles();

  return (
    <>
      <div className={styles.mainContainer}>
        <Title2 className={styles.sophisticatedText}>{customMessage.toUpperCase()}</Title2>
      </div>
    </>
  );
};

export default PersonalMessage;
