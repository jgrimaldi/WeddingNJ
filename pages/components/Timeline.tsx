import { LargeTitle, makeStyles, Subtitle1 } from "@fluentui/react-components";
import type { Invitation } from "@/types/invitations";
import TimelineItem from "./TimelineItem";
import timelineEn from "@/data/timeline.json";
import timelineEs from "@/data/timeline.es.json";

const useStyles = makeStyles({
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    fontFamily: "Segoe UI Light",
    color: "#3D3D3D",
    gap: "2em",
    padding: "2em",
    overflowX: "visible",
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
    gap: "1em",
    overflowX: "visible",
  },
});

type TimelineProps = {
  residency?: Invitation["Residency"]; // 'Local' | 'Remote'
  language?: "EN" | "ES";
};

const Timeline = ({ residency, language = "EN" }: TimelineProps) => {
  const styles = useStyles();
  const normalizedResidency = residency?.toLowerCase();
  const isRemote = normalizedResidency === "remote";
  const titleText = isRemote ? (language === "ES" ? "Fin de semana de boda" : "The Wedding Weekend") : (language === "ES" ? "Día de la Boda" : "Wedding Day");
  const dateText = isRemote ? (language === "ES" ? "Vie Feb 27 - Dom Mar 1" : "Fri Feb 27 - Sun Mar 1") : "Sat Feb 28";
  const source = language === "ES" ? (timelineEs as Array<any>) : (timelineEn as Array<any>);
  const dateLocale = language === "ES" ? "es-CR" : "en-US";
  const filtered = source.filter((item) => {
    const g = String(item.guests || "All").toLowerCase();
    if (g === "all") return true;
    return normalizedResidency ? g === normalizedResidency : g === "all";
  });

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.titleContainer}>
          <LargeTitle className={styles.titleFont}>
            {titleText.toUpperCase()}
          </LargeTitle>
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
              detailsBackgroundUrl={item.detailsBackgroundUrl}
              dateLocale={dateLocale}
              subTime1={item.subTime1}
              subTime1Label={item.subTime1Label}
              subTime2={item.subTime2}
              subTime2Label={item.subTime2Label}
              subTime3={item.subTime3}
              subTime3Label={item.subTime3Label}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Timeline;
