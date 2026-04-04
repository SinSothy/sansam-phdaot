import { describe, it, expect, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from './setup';
import { workspaceService } from '../services/workspace.service';
import { ApiResponse, Workspace } from '../types';

describe('Workspace Service Integration', () => {
  it('successfully fetches workspaces with the correct base envelope', async () => {
    const mockWorkspaces: Workspace[] = [
      { id: '1', name: 'Test Workspace', slug: 'test-workspace' }
    ];

    const mockResponse: ApiResponse<Workspace[]> = {
      status: 'success',
      message: 'Workspaces retrieved successfully',
      data: mockWorkspaces,
      error: null,
      meta: { timestamp: new Date().toISOString() }
    };

    // Intercept the POST request to /workspaces/list
    server.use(
      http.post('*/api/workspaces/list', async ({ request }: { request: Request }) => {
        const body = await request.json() as any;

        // Verify the standard request envelope
        expect(body.header).toBeDefined();
        expect(body.header.platform).toBe('web');
        expect(body.header.userID).toBeDefined();
        expect(body.body).toEqual({});

        return HttpResponse.json(mockResponse);
      })
    );

    const result = await workspaceService.listWorkspaces();
    
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Test Workspace');
  });

  it('handles API errors gracefully and triggers the error handler', async () => {
    // Intercept and return an error
    server.use(
      http.post('*/api/workspaces/list', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    // We expect the service to throw because apiCore re-throws after handling
    await expect(workspaceService.listWorkspaces()).rejects.toThrow();
  });
});
