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
import { Language } from "@/types/invitations";

const useStyles = makeStyles({
  mainContainer: {
    display: "flex",
    paddingTop: "4em",
    flexDirection: "column",
    maxWidth: "60vw"
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

type BannerMessageProps = {
  language?: Language;
};

const BannerMessage = ({ language = 'EN' }: BannerMessageProps) => {
  const styles = useStyles();
  const messageEN = "We're thrilled to invite you to our wedding. We've created this space to share everything you need to know about our big day.";
  const messageES = "Estamos emocionados de invitarte a nuestra boda. Hemos creado este espacio para compartir todo lo que necesitas saber sobre nuestro gran día.";
  
  const getMessage = (): string => {
    return language === 'ES' ? messageES : messageEN;
  };

  return (
    <>
      <div className={styles.mainContainer}>
        <Title2 className={styles.sophisticatedText}>
          {getMessage()}
        </Title2>
      </div>
    </>
  );
};

export default BannerMessage;
