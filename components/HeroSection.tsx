import { makeStyles } from "@fluentui/react-components";

type HeroSectionProps = {
  bgColor: string;
  customComponent: React.ReactNode;
};

const useStyles = makeStyles({
  heroSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "-webkit-fill-available",
  },
});

const HeroSection = ({ bgColor = "light", customComponent }: HeroSectionProps) => {
  const styles = useStyles();

  return (
    <>
      <div
        className={styles.heroSection}
        style={{ backgroundColor: bgColor === "dark" ? "#D0D0D0" : "#FFFFFF" }}
      >
        {customComponent}
      </div>
    </>
  );
};

export default HeroSection;
