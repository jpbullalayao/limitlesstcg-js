export { LimitlessClient } from './limitless-client';
export * from './types';
export * from './resources/players';
export * from './resources/tournaments';
export * from './utils/pagination';

// Create default instance
import { LimitlessClient } from './limitless-client';
const limitless = new LimitlessClient();

export default limitless; 