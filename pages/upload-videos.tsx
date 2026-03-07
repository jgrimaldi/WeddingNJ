import Head from "next/head";
import { GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "@/lib/auth";
import TopNavBar from "@/components/TopNavBar";
import HeroSection from "@/components/HeroSection";
import BannerSubtitle from "@/components/BannerSubtitle";
import BannerMessage from "@/components/BannerMessage";
import VideoUpload from "@/components/VideoUpload";
import Footer from "@/components/Footer";
import { useSession } from "next-auth/react";

type UploadVideosPageProps = {
  groomWa?: string | null;
  brideWa?: string | null;
};

export default function UploadVideosPage({ groomWa, brideWa }: UploadVideosPageProps) {
  const { data: clientSession } = useSession();
  const lang =
    (clientSession?.user?.invitation?.Language as "EN" | "ES") || "EN";

  const isES = lang === "ES";
  const pageTitle = isES
    ? "Subir Videos | Boda de Nathy y Jorge"
    : "Upload Videos | Nathy & Jorge's Wedding";
  const bannerMessage = isES
    ? "¡Comparte tus videos favoritos de la boda con todos los invitados!"
    : "Share your favorite wedding videos with all the guests!";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="Upload your wedding videos" />
      </Head>
      <div style={{ backgroundColor: "var(--fluent-grey-10)" }}>
        <TopNavBar
          language={lang}
          residency={
            clientSession?.user?.invitation?.Residency as
              | "Local"
              | "Remote"
          }
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: "400px",
            width: "100%",
            margin: "0 auto",
            marginTop: "3em",
          }}
        >
          <HeroSection
            bgColor="light"
            customComponent={
              <BannerSubtitle
                imageSrc="/images/WeddingEnvelopeWC.png"
                topText={isES ? "Subir" : "Upload"}
                bottomText="Videos"
                alt="Upload Videos"
              />
            }
          />
          <HeroSection
            bgColor="light"
            customComponent={<BannerMessage text={bannerMessage} />}
          />
          <HeroSection
            bgColor="light"
            customComponent={<VideoUpload language={lang} />}
          />
          <Footer language={lang} groomWa={groomWa} brideWa={brideWa} />
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);
  if (!session) {
    const q = context.query || {};
    const rawLang =
      (Array.isArray(q.lang) ? q.lang[0] : q.lang) ||
      (Array.isArray(q.l) ? q.l[0] : q.l);
    const lang =
      typeof rawLang === "string" ? rawLang.toLowerCase() : undefined;
    const isValid = lang === "es" || lang === "en";
    const destination = isValid ? `/login?lang=${lang}` : "/login";
    return { redirect: { destination, permanent: false } };
  }
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
