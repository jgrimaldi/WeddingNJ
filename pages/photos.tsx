import Head from "next/head";
import { GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "@/lib/auth";
import TopNavBar from "@/components/TopNavBar";
import HeroSection from "@/components/HeroSection";
import BannerSubtitle from "@/components/BannerSubtitle";
import BannerMessage from "@/components/BannerMessage";
import PhotoGallery from "@/components/PhotoGallery";
import Footer from "@/components/Footer";
import { useSession } from "next-auth/react";
import { Button } from "@fluentui/react-components";
import { ArrowUpload24Regular } from "@fluentui/react-icons";
import { useRouter } from "next/router";

type PhotosPageProps = {
  groomWa?: string | null;
  brideWa?: string | null;
};

export default function PhotosPage({ groomWa, brideWa }: PhotosPageProps) {
  const { data: clientSession } = useSession();
  const router = useRouter();
  const lang =
    (clientSession?.user?.invitation?.Language as "EN" | "ES") || "EN";

  const isES = lang === "ES";
  const pageTitle = isES
    ? "Fotos | Boda de Nathy y Jorge"
    : "Photos | Nathy & Jorge's Wedding";
  const bannerMessage = isES
    ? "Revive los mejores momentos de nuestra celebración a través de las fotos compartidas por nuestros invitados."
    : "Relive the best moments of our celebration through photos shared by our guests.";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="Wedding photo gallery" />
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
                topText={isES ? "Galería" : "Photo"}
                bottomText={isES ? "de Fotos" : "Gallery"}
                alt="Photo Gallery"
              />
            }
          />
          <HeroSection
            bgColor="light"
            customComponent={<BannerMessage text={bannerMessage} />}
          />
          <HeroSection
            bgColor="light"
            customComponent={
              <div style={{ padding: "0 1em", width: "100%", boxSizing: "border-box" }}>
                <Button
                  appearance="primary"
                  icon={<ArrowUpload24Regular />}
                  onClick={() => router.push(`/upload?lang=${isES ? "es" : "en"}`)}
                  style={{
                    width: "100%",
                    backgroundColor: "#4C4C4C",
                    border: "2px solid #323232",
                    borderRadius: "4px",
                    fontWeight: "500",
                  }}
                >
                  {isES ? "Subir fotos" : "Upload photos"}
                </Button>
              </div>
            }
          />
          <HeroSection
            bgColor="light"
            customComponent={<PhotoGallery language={lang} />}
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
