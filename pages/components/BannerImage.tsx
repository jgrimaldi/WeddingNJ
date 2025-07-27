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
    backgroundImage: 'url("/images/JyNSTD1.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "25em",
    width: "100%",
    borderBottomLeftRadius: "10em",
    borderBottomRightRadius: "10em",
    filter: "grayscale(100%)",
  },
});

const BannerImage = () => {
  const styles = useStyles();

  return (
    <>
      <div className={styles.mainContainer}>
          
      </div>
    </>
  );
};

export default BannerImage;
