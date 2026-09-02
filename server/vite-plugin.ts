import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';
import { handleCreateAppointment, handleReviewAppointment } from './appointments';
import { clientIp, fail, type ApiResult } from './http';
import { handleOtpSend, handleOtpVerify } from './otp';

async function readBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString('utf8').trim();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function headersOf(req: IncomingMessage): Record<string, string | string[] | undefined> {
  return req.headers as Record<string, string | string[] | undefined>;
}

export async function dispatchApi(
  urlPath: string,
  method: string,
  body: unknown,
  headers: Record<string, string | string[] | undefined>,
  ip: string,
): Promise<ApiResult> {
  const path = urlPath.replace(/\/+$/, '') || '/';
  if (method !== 'POST') return fail('Method not allowed.', 405);

  if (path === '/api/otp/send') return handleOtpSend(body, ip);
  if (path === '/api/otp/verify') return handleOtpVerify(body);
  if (path === '/api/appointments') return handleCreateAppointment(body);
  if (path === '/api/appointments/review') return handleReviewAppointment(body, headers);
  return fail('Not found.', 404);
}

export function bookingApiPlugin(): Plugin {
  return {
    name: 'booking-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';
        if (!url.startsWith('/api/')) return next();
        await handleNodeRequest(req, res);
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';
        if (!url.startsWith('/api/')) return next();
        await handleNodeRequest(req, res);
      });
    },
  };
}

export async function handleNodeRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    const url = new URL(req.url || '/', 'http://localhost');
    const body = await readBody(req);
    if (body === null) {
      writeJson(res, 400, { error: 'Invalid JSON body.' });
      return;
    }
    const headers = headersOf(req);
    const ip = clientIp(headers, req.socket.remoteAddress || '');
    const result = await dispatchApi(url.pathname, req.method || 'GET', body, headers, ip);
    writeJson(res, result.status, result.body);
  } catch (err) {
    console.error('[api]', err instanceof Error ? err.message : err);
    writeJson(res, 500, { error: 'Something went wrong. Please try again.' });
  }
}

function writeJson(res: ServerResponse, status: number, body: Record<string, unknown>): void {
  const json = JSON.stringify(body);
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(json);
}
