export interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number>;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  [key: string]: string | number | undefined;
}

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface APIResponse<T> {
  data: T;
  meta?: PaginationMeta;
  message?: string;
}

export interface LimitlessConfig {
  baseURL?: string;
  timeout?: number;
  apiKey?: string;
  version?: string;
}

export enum TournamentStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum TournamentType {
  SWISS = 'swiss',
  SINGLE_ELIMINATION = 'single_elimination',
  DOUBLE_ELIMINATION = 'double_elimination',
  ROUND_ROBIN = 'round_robin',
}

export interface Tournament {
  id: string;
  name: string;
  format: string;
  type: string;
  startDate: string;
  endDate: string;
  status: TournamentStatus;
  playerCount: number;
  roundCount: number;
}

export interface TournamentStanding {
  rank: number;
  playerId: string;
  playerName: string;
  points: number;
  wins: number;
  losses: number;
  draws: number;
}

export interface Player {
  id: string;
  name: string;
  country: string;
}

export interface PlayerStats {
  totalTournaments: number;
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number;
}

export interface PlayerTournament {
  id: string;
  name: string;
  rank: number;
  points: number;
  wins: number;
  losses: number;
  draws: number;
}

export interface PlayerMatch {
  id: string;
  tournamentId: string;
  tournamentName: string;
  opponentId: string;
  opponentName: string;
  result: string;
  round: number;
}

export interface Match {
  id: string;
  tournamentId: string;
  round: number;
  table: number;
  player1Id: string;
  player1Name: string;
  player2Id: string;
  player2Name: string;
  player1Score?: number;
  player2Score?: number;
  status: MatchStatus;
  winner?: string;
}

export interface MatchListParams extends Record<string, string | number | undefined> {
  tournamentId?: string;
  playerId?: string;
  round?: number;
  status?: string;
}

export interface CreateMatchParams {
  tournamentId: string;
  round: number;
  table: number;
  player1Id: string;
  player2Id: string;
}

export interface UpdateMatchParams {
  player1Score?: number;
  player2Score?: number;
  status?: string;
  winner?: string;
}

export interface Decklist {
  id: string;
  name: string;
  format: string;
  playerId: string;
  playerName: string;
  tournamentId?: string;
  tournamentName?: string;
  isPublic: boolean;
  description?: string;
  cards: Array<{
    id: string;
    quantity: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface DecklistListParams extends Record<string, string | number | undefined> {
  format?: string;
  playerId?: string;
  tournamentId?: string;
  search?: string;
}

export interface CreateDecklistParams {
  name: string;
  format: string;
  cards: Array<{
    id: string;
    quantity: number;
  }>;
  isPublic?: boolean;
  tournamentId?: string;
  description?: string;
}

export interface UpdateDecklistParams extends Partial<CreateDecklistParams> {}

export interface TournamentListParams extends Record<string, string | number | undefined> {
  format?: string;
  status?: string;
  type?: string;
}

export interface CreateTournamentParams {
  name: string;
  format: string;
  type: string;
  startDate: string;
  endDate: string;
}

export interface UpdateTournamentParams extends Partial<CreateTournamentParams> {
  status?: string;
}

export interface PlayerListParams extends Record<string, string | number | undefined> {
  country?: string;
}

export enum MatchStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
} 