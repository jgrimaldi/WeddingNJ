import {
  Caption1,
  Body1,
  Divider,
  Title2,
  makeStyles,
  Link,
} from "@fluentui/react-components";
import {
  Location16Regular,
  Calendar16Regular,
  Tag16Regular,
} from "@fluentui/react-icons";

const useStyles = makeStyles({
  timelineItemContainer: {
    display: "flex",
    alignSelf: "flex-start",
    gap: "1em",
  },
  timelineItemColumn: {
    display: "flex",
    flexDirection: "column",
  },
  captionText: {
    textTransform: "uppercase",
  fontWeight: 500,
  },
  locationIcon: {
    marginRight: "0.4em",
    verticalAlign: "middle",
  },
  locationText: {
    textDecoration: "underline",
    textUnderlineOffset: "2px",
  },
  divider: {
    "&::before": {
      borderRightColor: "#8A8A8A",
    },
    "&::after": {
      borderRightColor: "#8A8A8A",
    },
  },
  textIconContainer: {
    display: "flex",
    alignItems: "center",
  },
  rowPadding: {
    paddingTop: "0.15em",
    paddingBottom: "0.15em",
  },
  titleText: {
    fontFamily: `'Playfair Display', serif`,
  },
});

type TimelineItemProps = {
  index: number | string;
  caption: string;
  title: string;
  location: string;
  locationUrl?: string;
  start: Date | string;
  end: Date | string;
  attire: string;
  description: string;
};

function formatIndex(value: number | string): string {
  const num = typeof value === "string" ? parseInt(value, 10) : value;
  if (isNaN(num as number)) return String(value);
  return String(num).padStart(2, "0");
}

function toDate(d: Date | string): Date {
  return d instanceof Date ? d : new Date(d);
}

function formatTimeRange(start: Date | string, end: Date | string): string {
  const s = toDate(start);
  const e = toDate(end);
  const datePart = s.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const sTime = s.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  const eTime = e.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${datePart}, ${sTime} - ${eTime}`;
}

const TimelineItem = ({
  index,
  caption,
  title,
  location,
  locationUrl,
  start,
  end,
  attire,
  description,
}: TimelineItemProps) => {
  const styles = useStyles();
  const idx = formatIndex(index);
  const when = formatTimeRange(start, end);
  const mapUrl =
    locationUrl && locationUrl.trim().length > 0
      ? locationUrl
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          location
        )}`;

  return (
    <div className={styles.timelineItemContainer}>
      <Divider vertical alignContent="start" className={styles.divider}>
        {idx}
      </Divider>
      <div className={styles.timelineItemColumn}>
        <Caption1 className={styles.captionText}>{caption}</Caption1>
  <Title2 className={styles.titleText}>{title}</Title2>
        <div className={`${styles.textIconContainer} ${styles.rowPadding}`}>
          <Location16Regular className={styles.locationIcon} />
          <Link
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            appearance="subtle"
            className={styles.locationText}
          >
            <Body1>{location}</Body1>
          </Link>
        </div>
        <div className={`${styles.textIconContainer} ${styles.rowPadding}`}>
          <Calendar16Regular className={styles.locationIcon} />
          <Body1>{when}</Body1>
        </div>
        <div className={`${styles.textIconContainer} ${styles.rowPadding}`}>
          <Tag16Regular className={styles.locationIcon} />
          <Body1>{attire}</Body1>
        </div>
        <Body1 className={styles.rowPadding}>{description}</Body1>
      </div>
    </div>
  );
};

export default TimelineItem;
