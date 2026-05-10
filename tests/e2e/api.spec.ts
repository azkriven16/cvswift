import { expect, test } from "@playwright/test";

async function expectResponseText(response: { text: () => Promise<string> }, expected: string) {
  await expect(response.text()).resolves.toContain(expected);
}

test.describe("API smoke tests", () => {
  test("resume collection validates input and auth/setup states", async ({ request }) => {
    const listResponse = await request.get("/api/resumes");
    expect([200, 401, 503]).toContain(listResponse.status());

    const createResponse = await request.post("/api/resumes", { data: {} });
    expect(createResponse.status()).toBe(400);
    await expectResponseText(createResponse, "title is required");
  });

  test("audit endpoint validates required resume id", async ({ request }) => {
    const response = await request.post("/api/audits", { data: {} });
    expect(response.status()).toBe(400);
    await expectResponseText(response, "resumeId is required");
  });

  test("upload endpoint validates required file", async ({ request }) => {
    const response = await request.post("/api/uploads", { multipart: {} });
    expect(response.status()).toBe(400);
    await expectResponseText(response, "file is required");
  });

  test("AI rewrite endpoint stays disabled for the free MVP", async ({ request }) => {
    const response = await request.post("/api/ai/rewrite", { data: {} });
    expect(response.status()).toBe(501);
    await expectResponseText(response, "AI rewrites are planned");
  });

  test("job post extraction requires authentication", async ({ request }) => {
    // Endpoint now requires a valid session — unauthenticated callers get 401 (or 503 if Supabase not configured).
    const missingFileResponse = await request.post("/api/job-post/extract", { multipart: {} });
    expect([401, 503]).toContain(missingFileResponse.status());

    const textResponse = await request.post("/api/job-post/extract", {
      multipart: {
        kind: "job",
        file: {
          name: "job-post.txt",
          mimeType: "text/plain",
          buffer: Buffer.from("Senior Frontend Engineer\nReact, Next.js, TypeScript, accessibility."),
        },
      },
    });
    expect([401, 503]).toContain(textResponse.status());
  });

  test("auth utility routes redirect without server errors", async ({ request }) => {
    const logoutResponse = await request.get("/logout", { maxRedirects: 0 });
    expect([302, 303, 307, 308]).toContain(logoutResponse.status());

    const callbackResponse = await request.get("/auth/callback?next=/login", { maxRedirects: 0 });
    expect([302, 303, 307, 308]).toContain(callbackResponse.status());
  });
});
