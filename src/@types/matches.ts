// types/matches.ts
export interface Team {
  teamId?: string;
  teamName: string;
  teamSName?: string;
  image?: string;
  score?: {
    score: string;
    inngs1?: {
      runs: number;
      wickets: number;
      overs: number;
    };
    inngs2?: {
      runs: number;
      wickets: number;
      overs: number;
    };
  };
}

export interface Match {
  matchId: string;
  decimalId: string;
  matchDesc: string;
  seriesName: string;
  state: "Complete" | "Live" | "In Progress" | "Upcoming" | "PostPoned" | "Preview" | "Toss" | "Stumps" | "Abandoned";
  city?: string;
  status: string;
  team1: Team;
  team2: Team;
}
