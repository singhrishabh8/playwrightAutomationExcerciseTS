import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { attachment, ContentType, step } from 'allure-js-commons';
import { BASE_URL } from '../config/env';
import type { ApiEnvelope } from './types';

type FormBody = Record<string, string>;
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/**
 * Why a thin wrapper: these APIs often return HTTP 200 with the real outcome in
 * JSON `responseCode`. Asserting only HTTP status would produce false greens.
 *
 * Each call also attaches a curl recreation + JSON body to Allure so API steps
 * are reviewable in the report without opening traces.
 */
export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async getJson<T extends Record<string, unknown>>(path: string): Promise<ApiEnvelope<T>> {
    return this.requestJson<T>('GET', path);
  }

  async postForm<T extends Record<string, unknown>>(
    path: string,
    form: FormBody,
  ): Promise<ApiEnvelope<T>> {
    return this.requestJson<T>('POST', path, form);
  }

  async putForm<T extends Record<string, unknown>>(
    path: string,
    form: FormBody,
  ): Promise<ApiEnvelope<T>> {
    return this.requestJson<T>('PUT', path, form);
  }

  async deleteForm<T extends Record<string, unknown>>(
    path: string,
    form: FormBody,
  ): Promise<ApiEnvelope<T>> {
    return this.requestJson<T>('DELETE', path, form);
  }

  private async requestJson<T extends Record<string, unknown>>(
    method: HttpMethod,
    path: string,
    form?: FormBody,
  ): Promise<ApiEnvelope<T>> {
    const url = this.url(path);

    return step(`${method} ${path}`, async () => {
      await attachment('request.curl', this.toCurl(method, url, form), ContentType.TEXT);

      const response = await this.send(method, url, form);
      const raw = await response.text();
      const body = this.parseJson(raw);

      await attachment(
        'response.json',
        JSON.stringify(body, null, 2),
        ContentType.JSON,
      );
      await attachment(
        'response.meta.txt',
        `HTTP ${response.status()} ${response.statusText()}\nURL: ${response.url()}`,
        ContentType.TEXT,
      );

      // Transport failures are still useful to surface.
      expect(response.ok(), `HTTP ${response.status()} for ${response.url()}`).toBeTruthy();
      expect(body, 'API body should include responseCode').toHaveProperty('responseCode');
      return body as ApiEnvelope<T>;
    });
  }

  private async send(method: HttpMethod, url: string, form?: FormBody): Promise<APIResponse> {
    switch (method) {
      case 'GET':
        return this.request.get(url);
      case 'POST':
        return this.request.post(url, { form });
      case 'PUT':
        return this.request.put(url, { form });
      case 'DELETE':
        return this.request.delete(url, { form });
    }
  }

  private url(path: string): string {
    return `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  }

  /** Build a pasteable curl; redact password fields so reports stay shareable. */
  private toCurl(method: HttpMethod, url: string, form?: FormBody): string {
    const lines = [`curl -X ${method} '${url}'`];
    if (form && Object.keys(form).length > 0) {
      lines.push(`  -H 'Content-Type: application/x-www-form-urlencoded'`);
      const safe = Object.fromEntries(
        Object.entries(form).map(([key, value]) => [
          key,
          key.toLowerCase() === 'password' ? '***' : value,
        ]),
      );
      lines.push(`  --data-raw '${new URLSearchParams(safe).toString()}'`);
    }
    return lines.join(' \\\n');
  }

  private parseJson(raw: string): Record<string, unknown> {
    try {
      return JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return { parseError: 'Response was not valid JSON', raw };
    }
  }
}
