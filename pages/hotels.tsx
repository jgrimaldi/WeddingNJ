import Head from "next/head";
import { GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "@/lib/auth";
import TopNavBar from "@/components/TopNavBar";
import HeroSection from "@/components/HeroSection";
import BannerSubtitle from "@/components/BannerSubtitle";
import BannerMessage from "@/components/BannerMessage";
import HotelList from "@/components/HotelList";
import Footer from "@/components/Footer";
import { useSession } from "next-auth/react";

type HotelsPageProps = {
  groomWa?: string | null;
  brideWa?: string | null;
};

export default function HotelsPage({ groomWa, brideWa }: HotelsPageProps) {
  const { data: clientSession } = useSession();
  const lang = (clientSession?.user?.invitation?.Language as "EN" | "ES") || "EN";

  const pageTitle =
    lang === "ES" ? "Hoteles | Boda de Nathy y Jorge" : "Hotels | Nathy & Jorge's Wedding";

  const hotelMessageEN =
    "We’ve handpicked a list of hotel options and travel tips to help make your trip as smooth and enjoyable as possible.";
  const hotelMessageES =
    "Hemos seleccionado una lista de opciones de hoteles y vuelos para ayudar a que su viaje sea lo más fluido y agradable posible.";
  const bannerMessageTextHotel = lang === "ES" ? hotelMessageES : hotelMessageEN;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="Recommended hotels and travel information." />
      </Head>
      <div style={{ minHeight: "100vh", backgroundColor: "var(--fluent-grey-10)" }}>
        <TopNavBar language={lang} />
        <div style={{ marginTop: "3em", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <HeroSection
            bgColor="light"
            customComponent={
              <BannerSubtitle
                imageSrc="/images/HotelWatercolor.png"
                topText={lang === "ES" ? "Vuelos &" : "Travel"}
                bottomText={lang === "ES" ? "Hoteles" : "& Stay"}
                alt="Travel & Hotels"
              />
            }
          />
          <HeroSection bgColor="light" customComponent={<BannerMessage text={bannerMessageTextHotel} />} />
          <HeroSection bgColor="light" customComponent={<HotelList language={lang} />} />
          <Footer language={lang} groomWa={groomWa} brideWa={brideWa} />
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return {
    props: {
      groomWa: process.env.WHATSAPP_GROOM || process.env.NEXT_PUBLIC_WHATSAPP_GROOM || null,
      brideWa: process.env.WHATSAPP_BRIDE || process.env.NEXT_PUBLIC_WHATSAPP_BRIDE || null,
    },
  };
}
