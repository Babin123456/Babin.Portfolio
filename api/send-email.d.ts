import type { IncomingMessage, ServerResponse } from "node:http";

export interface ApiRequest extends IncomingMessage {
  body?: Record<string, unknown>;
}

export interface ApiResponse extends ServerResponse {
  status?: (code: number) => ApiResponse;
  json?: (data: unknown) => ApiResponse;
}

declare function handler(req: ApiRequest, res: ApiResponse): Promise<void>;

export default handler;
