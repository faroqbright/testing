import { title } from "process";

interface MatchesPageMainTabsData {
  title: string;
  queryName: string;
}
export const matchesPageMainTabsData: MatchesPageMainTabsData[] = [
  {
    title: "Live",
    queryName: "live",
  },
  {
    title: "Upcoming",
    queryName: "upcoming",
  },
  {
    title: "Recent",
    queryName: "recent",
  },
];
