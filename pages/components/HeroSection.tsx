import {
  makeStyles,
  Image,
} from "@fluentui/react-components";
import { Component } from "react";

type HeroSectionProps = {
  bgColor: string;
  imageBGSource?: string;
};

const useStyles = makeStyles({
  heroSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    //padding: "2em",
    width: "-webkit-fill-available",
  },
  image: {
    width: "100%",
    height: "auto",
    objectFit: "cover",
  },
});

const HeroSection = ({ bgColor = "light", imageBGSource }: HeroSectionProps) => {
  const styles = useStyles();

  return (
    <>
      <div
        className={styles.heroSection}
        style={{ backgroundColor: bgColor === "dark" ? "#0178D3" : "#1F1F1F" }}
      >
        {imageBGSource ? 
          <Image src={imageBGSource} className={styles.image} /> 
          : "Test"}
      </div>
    </>
  );
};

export default HeroSection;
