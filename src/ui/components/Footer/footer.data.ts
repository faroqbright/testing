interface FooterLink {
  title: string;
  to: string;
}

export interface FooterData {
  mainTitle: string;
  links: FooterLink[];
}

export const footerData: FooterData[] = [
  {
    links: [
      { to: "", title: "T20 Timeout" },
      { to: "", title: "Match Day" },
      { to: "", title: "ICC Rankings" },
    ],
    mainTitle: "quick links",
  },
  {
    links: [
      { title: "ILT20 2024", to: "" },
      { title: "BPL 2024", to: "Australia v South Africa [W]" },
      { title: "India v England", to: "" },
      { title: "The Marsh Cup", to: "" },
    ],
    mainTitle: "Series",
  },
  {
    links: [
      {
        title: "Android App",
        to: "https://play.google.com/store/apps/details?id=com.app.rn.cricap",
      },
      {
        title: "IOS App",
        to: "https://apps.apple.com/pk/app/cricap-everything-cricket/id6471257122",
      },
    ],
    mainTitle: "CriCap Apps",
  },
];
