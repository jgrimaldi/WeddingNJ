import { GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "@/lib/auth";
import Head from "next/head";
import { makeStyles, Title2 } from "@fluentui/react-components";
import TopNavBar from "./components/TopNavBar";
import HeroSection from "./components/HeroSection";
import Timer from "./components/Timer";
import Timeline from "./components/Timeline";
import BannerImage from "./components/BannerImage";
import BannerTitle from "./components/BannerTitle";
import PersonalMessage from "./components/PersonalMessage";
import { useSession } from "next-auth/react";
import BannerDateText from "./components/BannerDateText";
import BannerMessage from "./components/BannerMessage";
import BannerSubtitle from "./components/BannerSubtitle";

type HomePageProps = {
  // No session prop needed - we'll use client-side session
};

const useStyles = makeStyles({
  nav: {
    display: "flex",
  },
  mainContent: {
    marginTop: "3em", // Navbar height is ~3em, so add some margin to avoid overlap
  },
});

export default function HomePage({}: HomePageProps) {
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

  return (
    <>
      <Head>
        <title>Nathy & Jorge's Wedding</title>
        <meta name="description" content="Welcome to our wedding portal!" />
      </Head>

      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "var(--fluent-grey-10)",
        }}
      >
        <TopNavBar />

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
              <Timer targetDate={new Date("2026-02-28T14:00:00Z")} />
            }
          />
          <HeroSection
            bgColor="light"
            customComponent={
              <BannerMessage
                language={clientSession?.user?.invitation?.Language}
              />
            }
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
                language={clientSession?.user?.invitation?.Language as "EN" | "ES"}
              />
            }
          />

          <HeroSection
            bgColor="light"
            customComponent={
              <BannerSubtitle
                imageSrc="/images/HotelWatercolor.png"
                topText={
                  clientSession?.user?.invitation?.Language == "ES"
                    ? "Vuelos &"
                    : "Travel"
                }
                bottomText={
                  clientSession?.user?.invitation?.Language == "ES"
                    ? "Hoteles"
                    : "& Stay"
                }
                alt="Events preview"
              />
            }
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
      // We could pass simple data here if needed, but complex objects cause serialization issues
    },
  };
}
