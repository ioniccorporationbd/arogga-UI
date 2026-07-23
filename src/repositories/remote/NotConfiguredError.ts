export class NotConfiguredError extends Error {
  constructor(repository: string) {
    super(`${repository} is not configured. Set DATA_SOURCE=local or provide API_BASE_URL and implement the remote adapter.`);
    this.name = "NotConfiguredError";
  }
}
