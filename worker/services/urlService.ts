import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "../db/schema";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { CacheService, type CachedUrlData } from "./cacheService";

export class UrlService {
  private db: DrizzleD1Database<typeof schema>;
  private cache?: CacheService;

  constructor(database: D1Database, kvNameSpace?: KVNamespace) {
    this.db = drizzle(database, { schema });
    if (kvNameSpace) {
      this.cache = new CacheService(kvNameSpace);
    }
  }

  async createShortUrl(
    originalUrl: string,
    userId: string,
    isProtected: boolean = false,
    authorizedEmails: string[] = [],
    notifyOnAccess: boolean = false
  ) {
    const shortCode = await this.generateUniqueShortCode();

    const shortUrl = await this.db
      .insert(schema.shortUrls)
      .values({
        id: nanoid(),
        userId,
        shortCode,
        originalUrl,
        isProtected,
        notifyOnAccess,
      })
      .returning();

    if (isProtected && authorizedEmails.length > 0) {
      const emailRecords = authorizedEmails.map((email) => ({
        id: nanoid(),
        shortUrlId: shortUrl[0].id,
        email: email.toLowerCase().trim(),
      }));

      await this.db
        .insert(schema.protectedUrlAuthorizedEmails)
        .values(emailRecords);
    }

    // Cache the new url
    if (this.cache) {
      try {
        const user = await this.db.query.user.findFirst({
          where: eq(schema.user.id, userId),
        });

        if (user) {
          const cachedData: CachedUrlData = {
            id: shortUrl[0].id,
            shortCode: shortUrl[0].shortCode,
            originalUrl: shortUrl[0].originalUrl,
            userId: shortUrl[0].userId,
            isProtected: shortUrl[0].isProtected,
            notifyOnAccess: shortUrl[0].notifyOnAccess,
            active: shortUrl[0].active,
            authorizedEmails: isProtected ? authorizedEmails : [],
            userEmail: user.email,
          };

          await this.cache.cacheUrl(shortCode, cachedData);
          console.log("Cached a new URL");
        }
      } catch (error) {
        console.error("Error caching new URL:", error);
      }
    }

    return {
      id: shortUrl[0].id,
      shortCode: shortUrl[0].shortCode,
      originalUrl: shortUrl[0].originalUrl,
      isProtected: shortUrl[0].isProtected,
      createdAt: shortUrl[0].createdAt,
    };
  }

  async getUserUrls(userId: string) {
    const urls = await this.db.query.shortUrls.findMany({
      where: eq(schema.shortUrls.userId, userId),
      orderBy: (shortUrls, { desc }) => [desc(shortUrls.createdAt)],
      with: {
        authorizedEmails: true,
      },
    });

    return urls.map((url) => ({
      id: url.id,
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      notifyOnAccess: url.notifyOnAccess,
      isProtected: url.isProtected,
      createdAt: url.createdAt,
      authorizedEmails: url.authorizedEmails?.map((ae) => ae.email) || [],
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

    if (this.cache) {
      try {
        await this.cache.invalidateUrl(url.shortCode);
      } catch (error) {
        console.error("Error invalidating URL cache:", error);
      }
    }
  }

  async getUrlByShortCode(shortCode: string) {
    if (this.cache) {
      try {
        // Check hot URLs first
        let cachedUrl = await this.cache.getHotUrl(shortCode);
        if (cachedUrl) {
          // Increment access count
          await this.cache.incrementUrlAccess(shortCode);

          return {
            id: cachedUrl.id,
            shortCode: cachedUrl.shortCode,
            originalUrl: cachedUrl.originalUrl,
            userId: cachedUrl.userId,
            isProtected: cachedUrl.isProtected,
            notifyOnAccess: cachedUrl.notifyOnAccess,
            active: cachedUrl.active,
            authorizedEmails:
              cachedUrl.authorizedEmails?.map((email) => ({ email })) || [],
            user: { email: cachedUrl.userEmail },
          };
        }

        // Check regular cache
        cachedUrl = await this.cache.getCachedUrl(shortCode);
        if (cachedUrl) {
          // Increment access count
          await this.cache.incrementUrlAccess(shortCode);
          return {
            id: cachedUrl.id,
            shortCode: cachedUrl.shortCode,
            originalUrl: cachedUrl.originalUrl,
            userId: cachedUrl.userId,
            isProtected: cachedUrl.isProtected,
            notifyOnAccess: cachedUrl.notifyOnAccess,
            active: cachedUrl.active,
            authorizedEmails:
              cachedUrl.authorizedEmails?.map((email) => ({ email })) || [],
            user: { email: cachedUrl.userEmail },
          };
        }
      } catch (error) {
        console.error("Error reading from cache:", error);
      }
    }

    // Cache miss
    const url = await this.db.query.shortUrls.findFirst({
      where: eq(schema.shortUrls.shortCode, shortCode),
      with: {
        authorizedEmails: true,
        user: true,
      },
    });

    // Cache the result
    if (url && this.cache) {
      try {
        const cachedData: CachedUrlData = {
          id: url.id,
          shortCode: url.shortCode,
          originalUrl: url.originalUrl,
          userId: url.userId,
          isProtected: url.isProtected,
          notifyOnAccess: url.notifyOnAccess,
          active: url.active,
          authorizedEmails: url.authorizedEmails?.map((ae) => ae.email) || [],
          userEmail: url.user.email,
        };

        await this.cache.cacheUrl(shortCode, cachedData);
        await this.cache.incrementUrlAccess(shortCode);
      } catch (error) {
        console.error("Error caching URL from database:", error);
      }
    }

    return url;
  }

  async isEmailAuthorized(shortUrlId: string, email: string): Promise<boolean> {
    const authorizedEmail =
      await this.db.query.protectedUrlAuthorizedEmails.findFirst({
        where: and(
          eq(schema.protectedUrlAuthorizedEmails.shortUrlId, shortUrlId),
          eq(
            schema.protectedUrlAuthorizedEmails.email,
            email.toLowerCase().trim()
          )
        ),
      });

    return !!authorizedEmail;
  }

  async createAccessVerificationToken(
    shortUrlId: string,
    email: string
  ): Promise<string> {
    const token = nanoid(32);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await this.db.insert(schema.urlAccessVerification).values({
      id: nanoid(),
      shortUrlId,
      email: email.toLowerCase().trim(),
      token,
      expiresAt,
    });

    return token;
  }

  async verifyAccessToken(token: string): Promise<{
    success: boolean;
    shortUrlId?: string;
    email?: string;
    originalUrl?: string;
    ownerEmail?: string;
    notifyOnAccess?: boolean;
    error?: string;
  }> {
    const verification = await this.db.query.urlAccessVerification.findFirst({
      where: and(
        eq(schema.urlAccessVerification.token, token),
        eq(schema.urlAccessVerification.used, false)
      ),
      with: {
        shortUrl: {
          with: {
            user: true,
          },
        },
      },
    });

    if (!verification) {
      return { success: false, error: "Invalid verification token" };
    }

    if (new Date() > verification.expiresAt) {
      return { success: false, error: "Verification token has expired" };
    }

    const isAuthorized = await this.isEmailAuthorized(
      verification.shortUrlId,
      verification.email
    );

    if (!isAuthorized) {
      await this.db
        .update(schema.urlAccessVerification)
        .set({ used: true })
        .where(eq(schema.urlAccessVerification.id, verification.id));

      return {
        success: false,
        error: "Email not authorized to access this URL",
      };
    }

    await this.db
      .update(schema.urlAccessVerification)
      .set({ used: true })
      .where(eq(schema.urlAccessVerification.id, verification.id));

    return {
      success: true,
      shortUrlId: verification.shortUrlId,
      email: verification.email,
      originalUrl: verification.shortUrl.originalUrl,
      ownerEmail: verification.shortUrl.user.email,
      notifyOnAccess: verification.shortUrl.notifyOnAccess,
    };
  }

  private async generateUniqueShortCode(): Promise<string> {
    let shortCode = nanoid(7);
    let attempts = 0;

    while (attempts < 5) {
      const existing = await this.db.query.shortUrls.findFirst({
        where: eq(schema.shortUrls.shortCode, shortCode),
      });
      if (!existing) break;
      shortCode = nanoid(7);
      attempts++;
    }

    if (attempts >= 5) {
      throw new Error("Failed to generate unique short code");
    }

    return shortCode;
  }
}
