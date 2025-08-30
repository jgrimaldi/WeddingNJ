import {
  Caption1,
  Divider,
  LargeTitle,
  makeStyles,
  Subtitle1,
  Title1,
  Title3,
  Body1,
} from "@fluentui/react-components";
import { Language } from "@/types/invitations";

const useStyles = makeStyles({
  mainContainer: {
    display: "flex",
    paddingTop: "4em",
    flexDirection: "column",
    maxWidth: "70vw"
  },
  sophisticatedText: {
    fontFamily: "Segoe UI Light",
    fontSize: "1.4em",
    textAlign: "center",
    lineHeight: "1.3em",    
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
        <Body1 className={styles.sophisticatedText}>
          {getMessage()}
        </Body1>
      </div>
    </>
  );
};

export default BannerMessage;
