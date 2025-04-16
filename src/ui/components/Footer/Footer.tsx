import type { HTMLAttributes } from "react";
import React from "react";
import { FooterData, footerData } from "./footer.data";
import Link from "next/link";
import Img from "../Img/Img";

interface FooterProps extends HTMLAttributes<HTMLDivElement> {}

const Footer: React.FC<FooterProps> = ({ ...props }) => {
  return (
    <footer className="bg-black w-full h-64 md:flex justify-center place-items-center hidden mt-5" {...props}>
      <div className="flex-1">
        <Img src={"/assets/imgs/icons/logo.png"} height={200} width={200} alt="CriCap" />
      </div>
      {footerData.map((data) => (
        <FooterCard key={data.mainTitle} data={data} />
      ))}
    </footer>
  );
};
export default Footer;

interface FooterCardProps extends HTMLAttributes<HTMLDivElement> {
  data: FooterData;
}

const FooterCard: React.FC<FooterCardProps> = ({ data, ...props }) => {
  return (
    <div className="flex-1 h-full p-2 gap-2 flex flex-col" {...props}>
      <h3 className="text-white capitalize font-bold text-xl">{data.mainTitle}</h3>
      <div className="flex flex-col justify-center gap-2">
        {data.links.map((link) =>
          link.to.startsWith("http") ? (
            <a
              key={link.title}
              href={link.to}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:underline"
            >
              {link.title}
            </a>
          ) : (
            <Link key={link.title} href={link.to || "#"} className="text-white hover:underline">
              {link.title}
            </Link>
          )
        )}
      </div>
    </div>
  );
};