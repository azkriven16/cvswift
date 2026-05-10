import { expect, test } from "@playwright/test";

const pages = ["/", "/pricing", "/login", "/app/resumes/new"];

test.describe("page smoke tests", () => {
  for (const path of pages) {
    test(`${path} returns HTML without a server error`, async ({ request }) => {
      const response = await request.get(path);
      const body = await response.text();

      expect(response.status(), `${path} response status`).toBeLessThan(500);
      expect(response.headers()["content-type"]).toContain("text/html");
      expect(body.trim()).not.toBe("");
    });
  }
});
