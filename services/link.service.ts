import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";

const MAX_RETRIES = 5;

interface CreateShortLinkInput {
  originalUrl: string;
  alias?: string;
  expiresAt?: string;
}

export async function createShortLink({
  originalUrl,
  alias,
  expiresAt,
}: CreateShortLinkInput) {
  const expiryDate = expiresAt
    ? new Date(expiresAt)
    : undefined;

  // Custom alias
  if (alias) {
    const existingAlias = await prisma.shortLink.findUnique({
      where: {
        code: alias,
      },
    });

    if (existingAlias) {
      throw new Error("CODE_ALREADY_EXISTS");
    }

    return await prisma.shortLink.create({
      data: {
        code: alias,
        originalUrl,
        expiresAt: expiryDate,
      },
    });
  }

  // Check existing URL
  const existingLink = await prisma.shortLink.findFirst({
    where: {
      originalUrl,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (existingLink) {
    return existingLink;
  }

  // Generate random code
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const code = nanoid(6);

    try {
      return await prisma.shortLink.create({
        data: {
          code,
          originalUrl,
          expiresAt: expiryDate,
        },
      });
    } catch (error: any) {
      if (error?.code === "P2002") {
        continue;
      }

      throw error;
    }
  }

  throw new Error("UNABLE_TO_GENERATE_CODE");
}