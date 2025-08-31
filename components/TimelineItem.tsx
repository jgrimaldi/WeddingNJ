import {
  Caption1,
  Body1,
  Divider,
  Title2,
  makeStyles,
  Link,
} from "@fluentui/react-components";
import { } from "react";
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
  cursor: "default",
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
    // Remove default focus outline but keep an accessible focus-visible ring
    ":focus": {
      outline: "none",
    },
    ":active": {
      outline: "none",
    },
    ":focus-visible": {
      outline: "2px solid #D1D5DB",
      outlineOffset: "2px",
      borderRadius: "6px",
    },
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
  whenText: {
    fontSize: "1em",
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
  expandSection: {
    transition:
      "max-height 600ms ease, opacity 220ms ease, transform 600ms ease",
  },
  expandClosed: {
    maxHeight: 0,
    opacity: 0,
    transform: "translateX(-20em)",
  },
  expandOpen: {
    maxHeight: "10em",
    opacity: 1,
    transform: "translateX(0)",
  },
  itemDetails: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: "1em 0",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    borderTopRightRadius: "10em",
    borderBottomRightRadius: "10em",
    filter: "grayscale(100%)",
    height: "5em",
    marginLeft: "-4em",
    gap: "1em",
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      background: "linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35))",
      pointerEvents: "none",
      zIndex: 0,
    },
  },
  subTimeContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    zIndex: 1,
  },
  subTimeText: {
    color: "#FFFFFF",
    fontFamily: `'Playfair Display', serif`,
    fontWeight: 500,
    fontSize: "1.25em",
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
  detailsBackgroundUrl?: string; // optional background image for details row
  dateLocale?: string; // e.g., 'es-CR' for Local, 'en-US' otherwise
  language?: "EN" | "ES";
  subTime1?: string;
  subTime1Label?: string;
  subTime2?: string;
  subTime2Label?: string;
  subTime3?: string;
  subTime3Label?: string;
};

function formatIndex(value: number | string): string {
  const num = typeof value === "string" ? parseInt(value, 10) : value;
  if (isNaN(num as number)) return String(value);
  return String(num).padStart(2, "0");
}

function toDate(d: Date | string): Date {
  return d instanceof Date ? d : new Date(d);
}

function pascalCaseWord(value: string, locale: string) {
  if (!value) return value;
  const [first, ...rest] = value;
  return (
    first.toLocaleUpperCase(locale) + rest.join("").toLocaleLowerCase(locale)
  );
}

function formatDatePartPascalCase(date: Date, locale: string): string {
  const parts = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).formatToParts(date);
  const transformed = parts.map((p) => {
    if (p.type === "weekday" || p.type === "month") {
      return { ...p, value: pascalCaseWord(p.value, locale) };
    }
    return p;
  });
  return transformed.map((p) => p.value).join("");
}

function formatTimeRange(
  start: Date | string,
  end: Date | string,
  locale: string = "en-US"
): string {
  const s = toDate(start);
  const e = toDate(end);
  const datePart = formatDatePartPascalCase(s, locale);
  const sTime = s.toLocaleTimeString(locale, {
    hour: "numeric",
    minute: "2-digit",
  });
  const eTime = e.toLocaleTimeString(locale, {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${datePart}`;
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
  detailsBackgroundUrl,
  dateLocale,
  language = "EN",
  subTime1,
  subTime1Label,
  subTime2,
  subTime2Label,
  subTime3,
  subTime3Label,
}: TimelineItemProps) => {
  const styles = useStyles();
  const detailsBg = detailsBackgroundUrl ?? "/images/TenisWC.png";
  const idx = formatIndex(index);
  const when = formatTimeRange(start, end, dateLocale ?? "en-US");
  const mapUrl =
    locationUrl && locationUrl.trim().length > 0
      ? locationUrl
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          location
        )}`;
  

  return (
    <div>
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
              onClick={(e) => e.stopPropagation()}
            >
              <Body1>{location}</Body1>
            </Link>
          </div>
          <div className={`${styles.textIconContainer} ${styles.rowPadding}`}>
            <Calendar16Regular className={styles.locationIcon} />
            <Body1 className={styles.whenText}>{when}</Body1>
          </div>
          <div className={`${styles.textIconContainer} ${styles.rowPadding}`}>
            <Tag16Regular className={styles.locationIcon} />
            <Body1>{attire}</Body1>
          </div>
          <Body1 className={styles.rowPadding}>{description}</Body1>          
        </div>
      </div>
  <div className={`${styles.expandSection} ${styles.expandOpen}`}>
        <div
          className={styles.itemDetails}
          style={{
            backgroundImage: `url('${detailsBg}')`,
          }}
        >
          {(subTime1 || subTime1Label) && (
            <div className={styles.subTimeContainer}>
              {subTime1 && (
                <Body1 className={styles.subTimeText}>{subTime1}</Body1>
              )}
              {subTime1Label && (
                <Body1 className={styles.subTimeText}>{subTime1Label}</Body1>
              )}
            </div>
          )}
          {(subTime2 || subTime2Label) && (
            <div className={styles.subTimeContainer}>
              {subTime2 && (
                <Body1 className={styles.subTimeText}>{subTime2}</Body1>
              )}
              {subTime2Label && (
                <Body1 className={styles.subTimeText}>{subTime2Label}</Body1>
              )}
            </div>
          )}
          {(subTime3 || subTime3Label) && (
            <div className={styles.subTimeContainer}>
              {subTime3 && (
                <Body1 className={styles.subTimeText}>{subTime3}</Body1>
              )}
              {subTime3Label && (
                <Body1 className={styles.subTimeText}>{subTime3Label}</Body1>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineItem;
