import {
  Caption1,
  LargeTitle,
  Subtitle1,
  makeStyles,
} from "@fluentui/react-components";
import type { Invitation } from "@/types/invitations";
import hotelsEn from "@/data/hotels.json";
import hotelsEs from "@/data/hotels.es.json";
import HotelListItem from "./HotelListItem";
import { Bed16Regular } from "@fluentui/react-icons";

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
    gap: "1.25em",
  },
  captionText: {
    textTransform: "uppercase",
    fontWeight: 500,
  },
  locationIcon: {
    marginRight: "0.4em",
    verticalAlign: "middle",
  }  
});

type HotelListProps = {
  residency?: Invitation["Residency"]; // 'Local' | 'Remote'
  language?: "EN" | "ES";
};

type Hotel = {
  Name: string;
  Location: string;
  LocationUrl: string;
  CeremonyCompare: string;
  ReceptionCompare: string;
  AirportCompare: string;
  OfferShuttle: boolean;
  Website: string;
  PriceRangePerNight: string;
  Review: string;
};

const HotelList = ({ residency, language = "EN" }: HotelListProps) => {
  const styles = useStyles();
  const isES = language === "ES";
  const hotels = (isES ? hotelsEs : hotelsEn) as Hotel[];
  const titleText = isES ? "HOTELES RECOMENDADOS" : "RECOMMENDED HOTELS";
  const dateText = isES
    ? "Opciones cercanas al evento"
    : "Options near the venues";
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
    review: isES ? "Comentario" : "Review",
    caption: isES ? "Hoteles" : "Hotels",
  } as const;

  return (
    <>
      <div className={styles.mainContainer}>
        <div>
          <Bed16Regular className={styles.locationIcon} />
          <Caption1 className={styles.captionText}>{labels.caption}</Caption1>
        </div>

        <div className={styles.itemsContainer}>
          {hotels.map((h, idx) => {
            return (
              <HotelListItem
                key={h.Name}
                index={idx + 1}
                name={h.Name}
                location={h.Location}
                locationUrl={h.LocationUrl}
                ceremonyCompare={h.CeremonyCompare}
                receptionCompare={h.ReceptionCompare}
                airportCompare={h.AirportCompare}
                offerShuttle={h.OfferShuttle}
                website={h.Website}
                priceRangePerNight={h.PriceRangePerNight}
                review={h.Review}
                language={language}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default HotelList;
