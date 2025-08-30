import { LargeTitle, makeStyles, Subtitle1 } from "@fluentui/react-components";
import type { Invitation } from "@/types/invitations";
import TimelineItem from "./TimelineItem";
import timeline from "@/data/timeline.json";

const useStyles = makeStyles({
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    fontFamily: "Segoe UI Light",
    color: "#3D3D3D",
    gap: "2em",
    padding: "2em",
  },
  titleContainer: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
  paddingTop: "2em",
  paddingBottom: "2em",
  },
  titleFont: {
    fontFamily: `'Playfair Display', serif`,
  fontWeight: 400,
  textAlign: "center",
  },
  itemsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "3em",
  },
});

type TimelineProps = {
  residency?: Invitation["Residency"]; // 'Local' | 'Remote'
};

const Timeline = ({ residency }: TimelineProps) => {
  const styles = useStyles();
  const normalizedResidency = residency?.toLowerCase();
  console.log("Invitation's residency:", residency);
  const isRemote = normalizedResidency === "remote";
  const titleText = isRemote ? "The Wedding Weekend" : "Wedding Day";
  const dateText = isRemote ? "Fri Feb 27 - Sun Mar 1" : "Sat Feb 28";
  const filtered = (timeline as Array<any>).filter((item) => {
    const g = String(item.guests || "All").toLowerCase();
    if (g === "all") return true;
    return normalizedResidency ? g === normalizedResidency : g === "all";
  });

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.titleContainer}>
          <LargeTitle className={styles.titleFont}>{titleText.toUpperCase()}</LargeTitle>
          <Subtitle1 className={styles.titleFont}>{dateText}</Subtitle1>
        </div>

        <div className={styles.itemsContainer}>
          {filtered.map((item, idx) => (
            <TimelineItem
              key={`${item.title}-${item.start}`}
              index={idx + 1}
              caption={item.caption}
              title={item.title}
              location={item.location}
              locationUrl={item.url}
              start={item.start}
              end={item.end}
              attire={item.attire}
              description={item.description}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Timeline;
