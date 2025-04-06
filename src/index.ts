export * from './limitless-client';
export * from './types';
export * from './resources/tournaments';

// Create default instance
import { LimitlessClient } from './limitless-client';
const limitless = new LimitlessClient();

export default limitless; 