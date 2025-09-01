import { GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "@/lib/auth";
import Head from "next/head";
import { makeStyles, Title2 } from "@fluentui/react-components";
import TopNavBar from "@/components/TopNavBar";
import HeroSection from "@/components/HeroSection";
import Timer from "@/components/Timer";
import Timeline from "@/components/Timeline";
import BannerImage from "@/components/BannerImage";
import BannerTitle from "@/components/BannerTitle";
import PersonalMessage from "@/components/PersonalMessage";
import { useSession } from "next-auth/react";
import BannerDateText from "@/components/BannerDateText";
import BannerMessage from "@/components/BannerMessage";
import BannerSubtitle from "@/components/BannerSubtitle";
import Footer from "@/components/Footer";
import RsvpForm from "@/components/RsvpForm";
import BannerSubmessage from "@/components/BannerSubmessage";
import HotelList from "@/components/HotelList";
import BannerSubmessageLink from "@/components/BannerSubmessageLink";

type HomePageProps = {
  groomWa?: string | null;
  brideWa?: string | null;
};

const useStyles = makeStyles({
  nav: {
    display: "flex",
  },
  mainContent: {
    marginTop: "3em", // Navbar height is ~3em, so add some margin to avoid overlap
  },
});

export default function HomePage({ groomWa, brideWa }: HomePageProps) {
  const { data: clientSession, status } = useSession();
  const styles = useStyles();

  // Show loading while session is being fetched
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // If no session at all, this shouldn't happen due to getServerSideProps redirect
  if (!clientSession) {
    console.log("No final session found!");
    return <div>No session found</div>;
  }

  console.log("Final session found:", clientSession);

  const welcomeMessageEN =
    "We've created this space to share everything you need to know about our big day.";
  const welcomeMessageES =
    "Hemos creado este espacio para compartir todo lo que necesitas saber sobre nuestro gran día.";
  const bannerMessageTextWelcome =
    clientSession?.user?.invitation?.Language === "ES"
      ? welcomeMessageES
      : welcomeMessageEN;

  const hotelMessageEN =
    "We’ve handpicked a list of hotel options and travel tips to help make your trip as smooth and enjoyable as possible.";
  const hotelMessageES =
    "Hemos seleccionado una lista de opciones de hoteles y vuelos para ayudar a que su viaje sea lo más fluido y agradable posible.";
  const bannerMessageTextHotel =
    clientSession?.user?.invitation?.Language === "ES"
      ? hotelMessageES
      : hotelMessageEN;
  const hotelMessageLinkEN = "Click here for the list of hotels.";
  const hotelMessageLinkES = "Haga clic aquí para ver la lista de hoteles.";
  const bannerMessageLinkTextHotel =
    clientSession?.user?.invitation?.Language === "ES"
      ? hotelMessageLinkES
      : hotelMessageLinkEN;

  const rsvpMessageEN =
    "Please help us by using the RSVP form to confirm your attendance.";
  const rsvpMessageES =
    "Por favor, ayúdanos utilizando el formulario de RSVP para confirmar tu asistencia.";
  const bannerMessageTextRsvp =
    clientSession?.user?.invitation?.Language === "ES"
      ? rsvpMessageES
      : rsvpMessageEN;
  const rsvpDateTextEN = "Kindly respond by December 1st, 2025.";
  const rsvpDateTextES =
    "Agradecemos confirmar asistencia antes del 1ero de Diciembre del 2025.";
  const bannerDateTextRsvp =
    clientSession?.user?.invitation?.Language === "ES"
      ? rsvpDateTextES
      : rsvpDateTextEN;

  const pageTitle =
    clientSession?.user?.invitation?.Language === "ES"
      ? "Boda de Nathy y Jorge"
      : "Nathy & Jorge's Wedding";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="Welcome to our wedding portal!" />
      </Head>

      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "var(--fluent-grey-10)",
        }}
      >
        <TopNavBar
          language={clientSession?.user?.invitation?.Language as "EN" | "ES"}
        />

        {/* Main Content Area */}
        <div
          className={styles.mainContent}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <HeroSection bgColor="light" customComponent={<BannerImage />} />
          <HeroSection
            bgColor="light"
            customComponent={
              <BannerTitle
                language={clientSession?.user?.invitation?.Language}
              />
            }
          />

          <HeroSection
            bgColor="light"
            customComponent={
              <PersonalMessage
                customMessage={
                  clientSession?.user?.invitation?.CustomGreet ||
                  "Welcome to our wedding portal!"
                }
              />
            }
          />

          <HeroSection
            bgColor="light"
            customComponent={
              <BannerDateText
                language={clientSession?.user?.invitation?.Language}
              />
            }
          />

          <HeroSection
            bgColor="light"
            customComponent={
              <BannerImage imageName="JyNSTDAlt3.jpg" roundedCorners="top" />
            }
          />
          <HeroSection
            bgColor="light"
            customComponent={
              <Timer
                targetDate={new Date("2026-02-28T14:00:00Z")}
                language={clientSession?.user?.invitation?.Language}
              />
            }
          />
          <HeroSection
            bgColor="light"
            customComponent={<BannerMessage text={bannerMessageTextWelcome} />}
          />

          <HeroSection
            bgColor="light"
            customComponent={
              <BannerSubtitle
                imageSrc="/images/SACCWatercolor.png"
                topText={
                  clientSession?.user?.invitation?.Language == "ES"
                    ? "Eventos"
                    : "Events"
                }
                alt="Events preview"
              />
            }
          />

          <HeroSection
            bgColor="light"
            customComponent={
              <Timeline
                residency={clientSession?.user?.invitation?.Residency}
                language={
                  clientSession?.user?.invitation?.Language as "EN" | "ES"
                }
              />
            }
          />

          {clientSession.user.invitation.Residency === "Remote" && (
            <HeroSection
              bgColor="light"
              customComponent={
                <BannerSubtitle
                  imageSrc="/images/HotelWatercolor.png"
                  topText={
                    clientSession?.user?.invitation?.Language == "ES"
                      ? "Vuelos y"
                      : "Travel"
                  }
                  bottomText={
                    clientSession?.user?.invitation?.Language == "ES"
                      ? "Hoteles"
                      : "and Stay"
                  }
                  alt="Events preview"
                />
              }
            />
          )}
          {clientSession.user.invitation.Residency === "Remote" && (
            <HeroSection
              bgColor="light"
              customComponent={
                <div>
                  <BannerMessage text={bannerMessageTextHotel} />
                  <BannerSubmessageLink text={bannerMessageLinkTextHotel} />
                </div>
              }
            />
          )}

          <HeroSection
            bgColor="light"
            customComponent={
              <BannerSubtitle
                imageSrc="/images/WeddingEnvelopeWC.png"
                topText={
                  clientSession?.user?.invitation?.Language == "ES"
                    ? "Asistencia"
                    : "RSVP"
                }
                alt="RSVP preview"
              />
            }
          />
          <HeroSection
            bgColor="light"
            customComponent={
              <div>
                <BannerMessage text={bannerMessageTextRsvp} />
                <BannerSubmessage text={bannerDateTextRsvp} />
              </div>
            }
          />
          <RsvpForm
            guests={clientSession?.user?.invitation?.Guests}
            language={clientSession?.user?.invitation?.Language}
            residency={clientSession?.user?.invitation?.Residency}
          />
          <Footer
            language={clientSession?.user?.invitation?.Language}
            groomWa={groomWa}
            brideWa={brideWa}
          />
        </div>
      </div>
    </>
  );
}

// Server-side authentication check
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);

  // If user is not authenticated, redirect to login
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // Don't pass complex session data through props - let client-side session handle it
  return {
    props: {
      groomWa:
        process.env.WHATSAPP_GROOM ||
        process.env.NEXT_PUBLIC_WHATSAPP_GROOM ||
        null,
      brideWa:
        process.env.WHATSAPP_BRIDE ||
        process.env.NEXT_PUBLIC_WHATSAPP_BRIDE ||
        null,
    },
  };
}
