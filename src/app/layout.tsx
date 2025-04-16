import type { Metadata } from "next";
import "./globals.css";
import MainHeader from "@/ui/components/MainHeader/MainHeader";
import NavigationPanel from "@/ui/components/Navigation/NavigationPanel";
import Footer from "@/ui/components/Footer/Footer";
import { Roboto } from "next/font/google";
import Modal from "@/ui/components/Modal/Modal";
import MainWrapper from "@/ui/components/MainWrapper";

export const metadata: Metadata = {
  title: "CriCap",
  description: "CriCap is a website to get latest updates and news about cricket",
};

const roboto = Roboto({ weight: ["100", "300", "400", "500", "700", "900"], subsets: ["cyrillic", "greek"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="theme-color" content="#ffffff"></meta>
      <body className="bg-mainBg">
        <MainWrapper>
          <div className="md:container  md:mt-[2%]">
            <MainHeader />
          </div>
          <div className="hidden md:block md:container">
            <NavigationPanel />
          </div>
          <div className="relative flex-1 overflow-y-scroll md:overflow-visible flex justify-between flex-col md:container">
            <div>{children}</div>
            <Footer />
          </div>
          <div className="md:hidden md:container">
            <NavigationPanel />
          </div>

          <Modal />
        </MainWrapper>
      </body>
    </html>
  );
}
