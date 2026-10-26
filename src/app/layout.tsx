import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

import { Chrome } from "@/components/chrome";
import { MobileActionBar } from "@/components/public/mobile-action-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSettings } from "@/lib/settings";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${settings.hospitalName} — Soins accessibles à Zinvié, Bénin`,
      template: `%s | ${settings.shortName}`,
    },
    description:
      "Hôpital « La Croix » de Zinvié : structure sanitaire confessionnelle créée en 1974 par les Religieux Camilliens. Consultations, urgences 24h/24, maternité, chirurgie, oncologie. Infos : " +
      settings.phone,
    keywords: [
      "hôpital Zinvié",
      "La Croix de Zinvié",
      "hôpital Abomey-Calavi",
      "hôpital Bénin",
      "consultation médicale",
      "Religieux Camilliens",
      "don",
      "FedaPay",
    ],
    openGraph: {
      title: settings.hospitalName,
      description: settings.tagline,
      type: "website",
      locale: "fr_BJ",
      images: [
        {
          url: "/images/hero-hopital.jpg",
          alt: "Le bâtiment de l'hôpital « La Croix » de Zinvié",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.hospitalName,
      description: settings.tagline,
      images: ["/images/hero-hopital.jpg"],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#294d57",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const settings = await getSettings();

  return (
    <html
      lang="fr"
      className={`${inter.variable} ${sourceSerif.variable}`}
    >
      <body className="flex min-h-screen flex-col antialiased">
        <Chrome
          header={
            <SiteHeader
              phone={settings.phone}
              emergencyPhone={settings.phoneEmergency}
              email={settings.email}
              facebook={settings.facebook}
              whatsapp={settings.whatsapp}
            />
          }
          footer={<SiteFooter />}
          mobileBar={
            <MobileActionBar
              phone={settings.phone}
              emergencyPhone={settings.phoneEmergency}
            />
          }
        >
          {children}
        </Chrome>
      </body>
    </html>
  );
}
