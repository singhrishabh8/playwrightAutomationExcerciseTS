import { APIRequestContext } from '@playwright/test';
import { ApiClient } from './client';
import type { CreateAccountParams, UserDetail } from './types';

/** Account practice APIs — use for direct API tests AND for UI test setup/cleanup. */
export class AccountApi {
  private readonly client: ApiClient;

  constructor(request: APIRequestContext) {
    this.client = new ApiClient(request);
  }

  createAccount(params: CreateAccountParams) {
    return this.client.postForm('/api/createAccount', params);
  }

  verifyLogin(email: string, password: string) {
    return this.client.postForm('/api/verifyLogin', { email, password });
  }

  /** Documented negative: omit email (do not send an empty string). */
  verifyLoginWithoutEmail(password: string) {
    return this.client.postForm('/api/verifyLogin', { password });
  }

  deleteAccount(email: string, password: string) {
    return this.client.deleteForm('/api/deleteAccount', { email, password });
  }

  getUserDetailByEmail(email: string) {
    return this.client.getJson<{ user: UserDetail }>(
      `/api/getUserDetailByEmail?email=${encodeURIComponent(email)}`,
    );
  }
}
