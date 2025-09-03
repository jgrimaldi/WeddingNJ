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
  const dressCodeMessageEN =
    "Our dress code for the wedding is formal attire—think suits, tuxedos, gowns, or cocktail dresses.";
  const dressCodeMessageES =
    "Nuestro código de vestimenta para la boda es formal: piensa en trajes, esmoquin, vestidos de gala o vestidos de cóctel.";
  const dressCodeMessageText =
    clientSession?.user?.invitation?.Language === "ES"
      ? dressCodeMessageES
      : dressCodeMessageEN;
  const dressCodeMessageBoldEN =
    "We only ask for women to avoid wearing either black or white.";
  const dressCodeMessageBoldES =
    "Solo pedimos a las mujeres que eviten usar negro o blanco.";
  const dressCodeMessageBoldText =
    clientSession?.user?.invitation?.Language === "ES"
      ? dressCodeMessageBoldES
      : dressCodeMessageBoldEN;
  const dressCodeMessageMenEN =
    "Guys, feel free to use any color.";
  const dressCodeMessageMenES =
    "Hombres, siéntanse libres de usar cualquier color.";
  const dressCodeMessageMenText =
    clientSession?.user?.invitation?.Language === "ES"
      ? dressCodeMessageMenES
      : dressCodeMessageMenEN;
  const giftsMessageEN =
    "Your presence is the greatest gift we could ask for. For those who still want to contribute, we have set up a cash fund for our honeymoon. A small box will be available at the reception to receive any contributions.";
  const giftsMessageES =
    "Tu presencia es el mejor regalo que podríamos pedir. Para quienes aún deseen contribuir, hemos establecido un fondo en efectivo para nuestra luna de miel. Se dispondrá de una pequeña caja en la recepción para recibir cualquier contribución.";
  const giftsMessageText =
    clientSession?.user?.invitation?.Language === "ES"
      ? giftsMessageES
      : giftsMessageEN;
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
          backgroundColor: "var(--fluent-grey-10)",
        }}
      >
        <TopNavBar
          language={clientSession?.user?.invitation?.Language as "EN" | "ES"}
          residency={clientSession?.user?.invitation?.Residency as "Local" | "Remote"}
        />
        
        {/* Main Content Area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: "400px",
            width: "100%",
            margin: "0 auto",
            marginTop: "3em", // Add back the top margin for fixed navbar
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
                imageSrc="/images/WeddingAttireWC.png"
                topText={
                  clientSession?.user?.invitation?.Language == "ES"
                    ? "Código de"
                    : "Dress Code"
                }
                bottomText={
                  clientSession?.user?.invitation?.Language == "ES"
                    ? "Vestimenta"
                    : ""
                }
                alt="Events preview"
              />
            }
          />
          <HeroSection
            bgColor="light"
            customComponent={
              <div>
                <BannerMessage text={dressCodeMessageText} />
                <BannerSubmessage boldText={dressCodeMessageBoldText} />
                <BannerSubmessage boldText={dressCodeMessageMenText} />
              </div>
            }
          />

          <HeroSection
            bgColor="light"
            customComponent={
              <BannerSubtitle
                imageSrc="/images/WeddingGiftWC.png"
                topText={
                  clientSession?.user?.invitation?.Language == "ES"
                    ? "Regalos"
                    : "Wedding"
                }
                bottomText={
                  clientSession?.user?.invitation?.Language == "ES"
                    ? ""
                    : "Gifts"
                }
                alt="Events preview"
              />
            }
          />
          <HeroSection
            bgColor="light"
            customComponent={
              <div>
                <BannerMessage text={giftsMessageText} />
              </div>
            }
          />

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
  // Preserve language parameter if provided (supports ?lang=es|en or ?l=es|en)
  const q = context.query || {};
  const rawLang = (Array.isArray(q.lang) ? q.lang[0] : q.lang) || (Array.isArray(q.l) ? q.l[0] : q.l);
  const lang = typeof rawLang === "string" ? rawLang.toLowerCase() : undefined;
  const isValid = lang === "es" || lang === "en";
  const destination = isValid ? `/login?lang=${lang}` : "/login";
    return {
      redirect: {
    destination,
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
