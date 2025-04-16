export interface Score {
  // Define the structure of the score object here
  // Example:
  runs: number;
  wickets: number;
  overs: number;
}

export interface Team {
  teamName: string;
  image: string;
  score: Score[];
  teamSName: string;
}

export interface Match {
  matchId: number;
  matchDesc: string;
  state: string;
  status: string;
  city: string;
  team1: Team;
  team2: Team;
}

// match details
export interface MatchInfo {
  matchId: number;
  matchDescription: string;
  matchFormat: string;
  matchType: string;
  complete: boolean;
  domestic: string;
  matchStartTimestamp: number;
  matchCompleteTimestamp: number;
  dayNight: boolean;
  date: string;
  time: string;
  year: number;
  dayNumber: number;
  state: string;
  team1: Team;
  team2: Team;
  series: Series;
  umpire1: Umpire;
  umpire2: Umpire;
  umpire3: Umpire;
  referee: Referee;
  tossResults: TossResults;
  status: string;
  venue: Venue;
}

export interface Team {
  id: number;
  name: string;
}

export interface Series {
  id: number;
  name: string;
}

export interface Umpire {
  name: string;
}

export interface Referee {
  name: string;
}

export interface TossResults {
  tossWinnerName: string;
}

export interface Venue {
  id: number;
  name: string;
  city: string;
  country: string;
  timezone: string;
  latitude: string;
  longitude: string;
}

export interface VenueInfo {
  established: number;
  capacity: string;
  knownAs: string;
  ends: string;
  city: string;
  county: string;
  timezone: string;
  homeTeam: string;
  floodlights: boolean;
  curator: string | null;
  profile: string | null;
  imageUrl: string;
  ground: string;
  groundLength: number;
  groundWidth: number;
  otherSports: string | null;
}

export interface MatchData {
  matchInfo: MatchInfo;
  venueInfo: VenueInfo;
  prediction: string | null;
}
