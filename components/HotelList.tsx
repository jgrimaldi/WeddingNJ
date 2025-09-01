import {
  Body1,
  Caption1,
  Divider,
  LargeTitle,
  Link,
  Subtitle1,
  Title2,
  makeStyles,
} from "@fluentui/react-components";
import type { Invitation } from "@/types/invitations";
import hotelsEn from "@/data/hotels.json";
import hotelsEs from "@/data/hotels.es.json";
import HotelListItem from "./HotelListItem";
import {
  Bed16Regular,
  AirplaneLandingRegular,
  Location16Regular,
} from "@fluentui/react-icons";
import Image from "next/image";

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
  itemsRowContainer: {
    display: "flex",
    gap: "1.25em",
  },
  captionText: {
    textTransform: "uppercase",
    fontWeight: 500,
  },
  subtitleIcon: {
    width: "16px",
    height: "16px",
  },
  subtitleRow: {
    display: "flex",
    alignItems: "center",
    gap: "1em",
  },
  divider: {
    "&::before": {
      borderRightColor: "#8A8A8A",
    },
    "&::after": {
      borderRightColor: "#8A8A8A",
    },
  },
  titleText: {
    fontFamily: `'Playfair Display', serif`,
  },
  locationText: {
    textDecoration: "underline",
    textUnderlineOffset: "2px",
  },
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
    flightCaption: isES ? "Vuelos" : "Flights",
    airBnbText: isES
      ? "Existen varias opciones en de Airbnb, las zonas que recomendamos son Belén, Escazú y Santa Ana, aunque existen opciones fuera de esas áreas que son igual de buenas. De existir una pregunta sobre una opción de Airbnb no duden en preguntarnos, con gusto investigaremos y compatiremos nuestra opinion."
      : "There are several Airbnb options available, the areas we recommend are Belén, Escazú, and Santa Ana, although there are options outside of those areas that are just as good. If you have any questions about a specific Airbnb option, please don't hesitate to ask us, and we will gladly investigate and share our opinion of it.",
    flightsText: isES
      ? "Hay 2 aeropuertos internacionales en Costa Rica, el SJO y el LIR. El más cercano a la boda es SJO, y deplazarse de el hacia hoteles en Alajuela, San Jose o Heredia es muy fácil con taxi, Uber o un shuttle. LIR esta ubicado en Guanacaste y es perfecto para quienes gusten hacer un tour por las playas del país, pero requiere de coordinar el transporte hacia la capital. Alquiler de carro o un vuelo doméstico con opciones a valorar."
      : "There are 2 international airports in Costa Rica, SJO and LIR. The closest one to the wedding is SJO, and getting from there to hotels in Alajuela, San Jose, or Heredia is very easy with a taxi, Uber, or shuttle. LIR is located in Guanacaste and it's perfect for those who want to tour the country's beaches, but it requires coordinating transportation to the capital. Car rentals or domestic flights are options to consider.",
    domesticFlight: isES
      ? "Los vuelos nacionales en Costa Rica son operados principalmente por Sansa."
      : "Domestic flights in Costa Rica are mainly operated by Sansa and Skyway. These flights connect San José with destinations like Liberia, Tamarindo, and Quepos, making it easy to reach various beaches and tourist attractions."
    } as const;

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.subtitleRow}>
          <Bed16Regular className={styles.subtitleIcon} />
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
        <div className={styles.subtitleRow}>
          <Image
            src="/logos/airbnb-logo.svg"
            alt="Airbnb Logo"
            width={14}
            height={14}
            priority
          />
          <Caption1 className={styles.captionText}>{`AirBnb`}</Caption1>
        </div>
        <div className={styles.itemsContainer}>
          <div className={styles.itemsRowContainer}>
            <Divider
              vertical
              alignContent="start"
              className={styles.divider}
            ></Divider>
            <Body1>{labels.airBnbText}</Body1>
          </div>
        </div>
        <div className={styles.subtitleRow}>
          <AirplaneLandingRegular className={styles.subtitleIcon} />
          <Caption1 className={styles.captionText}>
            {labels.flightCaption}
          </Caption1>
        </div>
        <div className={styles.itemsContainer}>
          <Body1>{labels.flightsText}</Body1>
          <div className={styles.itemsRowContainer}>
            <Divider vertical alignContent="start" className={styles.divider}>
              1
            </Divider>
            <div className={styles.itemsContainer}>
              <Title2
                className={styles.titleText}
              >{`Aeropuerto Juan Santa María SJO`}</Title2>
              <div className={styles.itemsRowContainer}>
                <Location16Regular className={styles.subtitleIcon} />
                <Link
                  href={`https://maps.app.goo.gl/UzGHdCC2VFiPgx2r5`}
                  target="_blank"
                  rel="noopener noreferrer"
                  appearance="subtle"
                  className={styles.locationText}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Body1>{`Río Segundo, Alajuela`}</Body1>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.itemsContainer}>
          <div className={styles.itemsRowContainer}>
            <Divider vertical alignContent="start" className={styles.divider}>
              2
            </Divider>
            <div className={styles.itemsContainer}>
              <Title2
                className={styles.titleText}
              >{`Aeropuerto Daniel Oduber LIR`}</Title2>
              <div className={styles.itemsRowContainer}>
                <Location16Regular className={styles.subtitleIcon} />
                <Link
                  href={`https://maps.app.goo.gl/PjXjA9uBeHapsNas9`}
                  target="_blank"
                  rel="noopener noreferrer"
                  appearance="subtle"
                  className={styles.locationText}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Body1>{`Liberia, Guanacaste`}</Body1>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Body1>{labels.flightsText}</Body1>

      </div>
    </>
  );
};

export default HotelList;
