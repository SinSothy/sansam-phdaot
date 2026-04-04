import { beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';

// This is the global setup for MSW
export const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
