import {
  makeStyles,
  Image,
} from "@fluentui/react-components";
import { Component } from "react";
import Timer from "./Timer";

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
  image: {
    width: "100%",
    maxHeight: "15em",
    objectFit: "cover",
    filter: "blur(1.5px)",
  },
});

const HeroSection = ({ bgColor = "light", customComponent }: HeroSectionProps) => {
  const styles = useStyles();

  return (
    <>
      <div
        className={styles.heroSection}
        style={{ backgroundColor: bgColor === "dark" ? "#D0D0D0" : "#E7E7E7" }}
      >
        {customComponent}
      </div>
    </>
  );
};

export default HeroSection;
