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
    paddingBottom: "4em",
    flexDirection: "column",
  },
  dateText: {
    fontFamily: "Playfair Display",
    color: "#3D3D3D",
    letterSpacing: "0.05em",
  }
});

type BannerDateTextProps = {
  language?: Language;
};

const BannerDateText = ({ language = 'EN' }: BannerDateTextProps) => {
  const styles = useStyles();

  // Format date based on language
  const getFormattedDate = (lang: Language): string => {
   
    if (lang === 'ES') {
      // Spanish format: day • month • year
      return "28 • 02 • 26";
    } else {
      // English format: month • day • year
      return "02 • 28 • 26";
    }
  };

  return (
    <>
      <div className={styles.mainContainer}>
        <Title2 className={styles.dateText}>{getFormattedDate(language)}</Title2>
      </div>
    </>
  );
};

export default BannerDateText;
