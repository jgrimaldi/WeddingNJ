import { GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "@/lib/auth";
import Head from "next/head";
import { makeStyles } from "@fluentui/react-components";
import TopNavBar from "./components/TopNavBar";
import HeroSection from "./components/HeroSection";
import Timer from "./components/Timer";
import Timeline from "./components/Timeline";

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
    marginTop: "3em", // Navbar height is ~3em, so add some margin to avoid overlap
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
            alignItems: "center",
          }}
        >
          <HeroSection bgColor="dark" customComponent={<Timer targetDate={new Date("2026-02-28T14:00:00Z")} />}/>
          <HeroSection bgColor="light" customComponent={<Timeline></Timeline>}/>
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
