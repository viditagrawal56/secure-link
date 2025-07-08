import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export class UrlService {
  private db: DrizzleD1Database<typeof schema>;

  constructor(database: D1Database) {
    this.db = drizzle(database, { schema });
  }

  async createShortUrl(originalUrl: string, userId: string) {
    const shortCode = await this.generateUniqueShortCode();

    const shortUrl = await this.db
      .insert(schema.shortUrls)
      .values({ id: nanoid(), userId, shortCode, originalUrl })
      .returning();

    return {
      id: shortUrl[0].id,
      shortCode: shortUrl[0].shortCode,
      originalUrl: shortUrl[0].originalUrl,
      createdAt: shortUrl[0].createdAt,
    };
  }

  async getUserUrls(userId: string) {
    const urls = await this.db.query.shortUrls.findMany({
      where: eq(schema.shortUrls.userId, userId),
      orderBy: (shortUrls, { desc }) => [desc(shortUrls.createdAt)],
    });

    return urls.map((url) => ({
      id: url.id,
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      createdAt: url.createdAt,
    }));
  }

  async deleteUrl(id: string, userId: string) {
    const url = await this.db.query.shortUrls.findFirst({
      where: eq(schema.shortUrls.id, id),
    });

    if (!url) {
      throw new Error("URL not found");
    }

    if (url.userId !== userId) {
      throw new Error("Undauthorized");
    }

    await this.db.delete(schema.shortUrls).where(eq(schema.shortUrls.id, id));
  }

  async getOriginalUrl(shortCode: string): Promise<string | null> {
    const url = await this.db.query.shortUrls.findFirst({
      where: eq(schema.shortUrls.shortCode, shortCode),
    });

    return url?.originalUrl || null;
  }

  private async generateUniqueShortCode(): Promise<string> {
    let shortCode = nanoid(7);
    let attempts = 0;

    while (attempts < 5) {
      const existing = await this.db.query.shortUrls.findFirst({
        where: eq(schema.shortUrls.shortCode, shortCode),
      });
      if (!existing) break;
      shortCode = nanoid(6);
      attempts++;
    }

    if (attempts >= 5) {
      throw new Error("Failed to generate unique short code");
    }

    return shortCode;
  }
}
