import { GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "@/lib/auth";
import Head from "next/head";
import { makeStyles } from "@fluentui/react-components";
import TopNavBar from "./components/TopNavBar";
import HoverCard from "./components/HoverCard";
import HeroSection from "./components/HeroSection";

type HomePageProps = {
  session: {
    user: {
      name: string;
      email?: string | null;
      image?: string | null;
      accessCode?: string | null;
    };
  };
};

const useStyles = makeStyles({
  nav: {
    display: "flex",
  },
  mainContent: {
    marginTop: "4em", // Navbar height is ~3.5em, so add some margin to avoid overlap
  },
});

export default function HomePage({ session }: HomePageProps) {
  const styles = useStyles();

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
            gap: "2em",
            alignItems: "center",
          }}
        >
          <HeroSection bgColor="light" imageBGSource={"/images/SACCBackgroundWatercolor.png"}/>
          <HeroSection bgColor="dark"/>
        </div>
      </div>
    </>
  );
}

// Server-side authentication check
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);
  console.log("SESSION:", session);

  // If user is not authenticated, redirect to login
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // Clean the session object to avoid serialization issues
  const cleanSession = {
    user: {
      name: session.user?.name || "Authorized User",
      email: session.user?.email || null,
      image: session.user?.image || null,
      accessCode: (session.user as any)?.accessCode || null,
    },
  };

  return {
    props: {
      session: cleanSession,
    },
  };
}
