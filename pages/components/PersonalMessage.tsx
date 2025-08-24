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
        <Title2 className={styles.sophisticatedText}>{customMessage}</Title2>
      </div>
    </>
  );
};

export default PersonalMessage;
