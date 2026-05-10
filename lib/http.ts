export const MAX_JSON_BODY_BYTES = 120_000;

export async function readJsonBody<T>(request: Request, fallback: T): Promise<{ data: T; error?: string }> {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_JSON_BODY_BYTES) {
    return { data: fallback, error: "Request body is too large." };
  }

  try {
    return { data: (await request.json()) as T };
  } catch {
    return { data: fallback };
  }
}
