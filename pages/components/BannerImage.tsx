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

type CornerPosition = 'top' | 'bottom';

type BannerImageProps = {
  roundedCorners?: CornerPosition;
};

const useStyles = makeStyles({
  mainContainer: {
    backgroundImage: 'url("/images/JyNSTD1.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "25em",
    width: "100%",
    filter: "grayscale(100%)",
  },
  roundedTop: {
    borderTopLeftRadius: "15em",
    borderTopRightRadius: "15em",
  },
  roundedBottom: {
    borderBottomLeftRadius: "15em",
    borderBottomRightRadius: "15em",
  },
});

const BannerImage = ({ roundedCorners = 'bottom' }: BannerImageProps) => {
  const styles = useStyles();

  // Determine which corner style to apply
  const getCornerClass = () => {
    return roundedCorners === 'top' ? styles.roundedTop : styles.roundedBottom;
  };

  return (
    <>
      <div className={`${styles.mainContainer} ${getCornerClass()}`}></div>
    </>
  );
};

export default BannerImage;
