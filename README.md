# LimitlessTCG JavaScript/TypeScript Client

A modern JavaScript/TypeScript client for the Limitless TCG API. This library provides a simple and intuitive interface to interact with all Limitless TCG API endpoints, with full TypeScript support.

## Installation

```bash
npm install limitlesstcg-js
# or
yarn add limitlesstcg-js
```

## Quick Start

```typescript
import limitless from "limitlesstcg-js";

// Configure with your API key (if needed)
limitless.setApiKey("your_api_key");

// List tournaments
const { data: tournaments, meta } = await limitless.tournaments
  .list()
  .firstPage();
console.log(`Found ${meta.total} tournaments`);

// Get a specific tournament
const tournament = await limitless.tournaments.retrieve("tournament_id");

// Get tournament standings
const standings = await limitless.tournaments.getStandings("tournament_id");
```

## Usage with TypeScript

The library is written in TypeScript and provides comprehensive type definitions:

```typescript
import {
  LimitlessClient,
  Tournament,
  TournamentListParams,
} from "limitlesstcg-js";

// Create a custom client instance
const client = new LimitlessClient({
  apiKey: "your_api_key",
  timeout: 5000,
});

// Use with type safety
const { data: tournaments, meta } = await client.tournaments
  .list({ format: "SV" })
  .firstPage();

// TypeScript will know that tournaments is Tournament[]
tournaments.forEach((tournament) => {
  console.log(tournament.name);
});
```

## Pagination

All list endpoints support pagination. You can work with paginated results in three ways:

```typescript
// 1. Get just the first page
const { data, meta } = await client.tournaments.list().firstPage();
console.log(`Page 1 of ${Math.ceil(meta.total / meta.pageSize)}`);

// 2. Iterate over all pages
for await (const tournaments of client.tournaments.list()) {
  console.log("Got page of tournaments:", tournaments);
}

// 3. Get all results at once (use with caution)
const allTournaments = await client.tournaments.list().all();
```

## Error Handling

The library provides structured error handling with TypeScript support:

```typescript
import {
  LimitlessAPIError,
  LimitlessAuthenticationError,
  LimitlessNetworkError,
} from "limitlesstcg-js";

try {
  const tournament = await limitless.tournaments.retrieve("invalid_id");
} catch (error) {
  if (error instanceof LimitlessAuthenticationError) {
    console.error("Authentication failed:", error.message);
    // Handle invalid API key or insufficient permissions
  } else if (error instanceof LimitlessAPIError) {
    console.error("API Error:", error.message);
    console.error("Status Code:", error.code);
    // Handle API errors (e.g., invalid parameters, rate limiting)
  } else if (error instanceof LimitlessNetworkError) {
    console.error("Network Error:", error.message);
    // Handle network issues
  }
}
```

## API Resources

The library provides access to the following Limitless TCG API resources:

### Tournaments

- `list()`: List all tournaments with pagination
- `retrieve(id)`: Get a specific tournament
- `create(params)`: Create a new tournament
- `update(id, params)`: Update a tournament
- `delete(id)`: Delete a tournament
- `getStandings(id)`: Get tournament standings

### Players

- `list()`: List all players with pagination
- `retrieve(id)`: Get a specific player
- `getStats(id)`: Get player statistics
- `getTournaments(id)`: Get player's tournament history
- `getMatches(id)`: Get player's match history

### Decklists

- `list()`: List all decklists with pagination
- `retrieve(id)`: Get a specific decklist
- `create(params)`: Create a new decklist
- `update(id, params)`: Update a decklist
- `delete(id)`: Delete a decklist
- `getSimilar(id)`: Find similar decklists
- `getArchetypeStats(id)`: Get archetype performance stats

### Matches

- `list()`: List all matches with pagination
- `retrieve(id)`: Get a specific match
- `create(params)`: Create a new match
- `update(id, params)`: Update a match
- `delete(id)`: Delete a match
- `reportResult(id, params)`: Report match result
- `getHeadToHead(player1Id, player2Id)`: Get head-to-head statistics

## Configuration

You can configure the client with the following options:

```typescript
const client = new LimitlessClient({
  apiKey: "your_api_key", // Your Limitless TCG API key
  baseURL: "custom_base_url", // Override the default API base URL
  timeout: 5000, // Request timeout in milliseconds
  version: "v1", // API version to use
});
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
