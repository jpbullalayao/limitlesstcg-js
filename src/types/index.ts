export interface LimitlessConfig {
  apiKey?: string;
  baseURL?: string;
  timeout?: number;
  version?: string;
}

export interface Tournament {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  format: string;
  status: TournamentStatus;
  playerCount: number;
  roundCount: number;
  type: TournamentType;
}

export interface Player {
  id: string;
  name: string;
  country?: string;
  ranking?: number;
}

export interface Decklist {
  id: string;
  playerId: string;
  tournamentId: string;
  name: string;
  cards: Card[];
  format: string;
  isPublic: boolean;
}

export interface Card {
  id: string;
  name: string;
  quantity: number;
  setCode?: string;
  number?: string;
}

export interface Match {
  id: string;
  tournamentId: string;
  round: number;
  table: number;
  player1Id: string;
  player2Id: string;
  player1Score: number;
  player2Score: number;
  status: MatchStatus;
  winner?: string;
}

export enum TournamentStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
}

export enum TournamentType {
  SWISS = 'swiss',
  SINGLE_ELIMINATION = 'single_elimination',
  DOUBLE_ELIMINATION = 'double_elimination',
}

export enum MatchStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export interface APIResponse<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
  };
}

export interface APIError {
  code: string;
  message: string;
  type: string;
} 