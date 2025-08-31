import { Caption1, Body1, Divider, Title2, makeStyles, Link } from "@fluentui/react-components";
import { mergeClasses } from "@fluentui/react-components";
import { } from "react";
import {
  Location16Regular,
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
});

type HotelListItemProps = {
  index: number | string;
  name: string;
  location: string;
  locationUrl?: string;
  ceremonyCompare: string;
  receptionCompare: string;
  airportCompare: string;
  offerShuttle: boolean;
  website: string;
  priceRangePerNight: string;
  review?: string;
  language?: "EN" | "ES";
};

function formatIndex(value: number | string): string {
  const num = typeof value === "string" ? parseInt(value, 10) : value;
  if (isNaN(num as number)) return String(value);
  return String(num).padStart(2, "0");
}

// timeline-specific helpers removed for hotel rendering

const HotelListItem = ({
  index,
  name,
  location,
  locationUrl,
  ceremonyCompare,
  receptionCompare,
  airportCompare,
  offerShuttle,
  website,
  priceRangePerNight,
  review,
  language = "EN",
}: HotelListItemProps) => {
  const styles = useStyles();
  const idx = formatIndex(index);
  const mapUrl =
    locationUrl && locationUrl.trim().length > 0
      ? locationUrl
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          location
        )}`;
  const isES = language === "ES";
  const labels = {
    location: isES ? "Ubicación" : "Location",
    ceremony: isES ? "Ceremonia" : "Ceremony",
    reception: isES ? "Recepción" : "Reception",
    airport: isES ? "Aeropuerto" : "Airport",
    shuttle: isES ? "Transporte" : "Shuttle",
    price: isES ? "Precio por noche" : "Price per night",
    website: isES ? "Sitio web" : "Website",
    yes: isES ? "Sí" : "Yes",
    no: isES ? "No" : "No",
    caption: isES ? "Hotel" : "Hotel",
  } as const;
  

  return (
    <div>
  <div className={styles.timelineItemContainer}>
        <Divider vertical alignContent="start" className={styles.divider}>
          {idx}
        </Divider>
        <div className={styles.timelineItemColumn}>          
          <Title2 className={styles.titleText}>{name}</Title2>
            <div className={mergeClasses(styles.textIconContainer, styles.rowPadding)}>
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
          <Body1 className={styles.rowPadding}>
            <strong>{labels.ceremony}:</strong> {ceremonyCompare} · <strong>{labels.reception}:</strong> {receptionCompare} · <strong>{labels.airport}:</strong> {airportCompare}
          </Body1>
            <div className={mergeClasses(styles.textIconContainer, styles.rowPadding)}>
            <Tag16Regular className={styles.locationIcon} />
            <Body1>
              <strong>{labels.shuttle}:</strong> {offerShuttle ? labels.yes : labels.no} • <strong>{labels.price}:</strong> {priceRangePerNight} • <strong>{labels.website}:</strong> {(() => {
                try {
                  const url = new URL(website.startsWith("http") ? website : `https://${website}`);
                  return url.hostname.replace("www.", "");
                } catch {
                  return website;
                }
              })()}
            </Body1>
          </div>
          {review && (
            <Body1 className={styles.rowPadding} style={{ fontStyle: "italic", color: "#4b5563" }}>
              {review}
            </Body1>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelListItem;
