import { NextResponse } from "next/server";
import { createLinkSchema } from "@/lib/validation";
import { createShortLink } from "@/services/link.service";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = createLinkSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_INPUT",
            message:
              result.error.issues[0]?.message ??
              "Invalid input",
          },
        },
        { status: 400 }
      );
    }

    const link = await createShortLink({
      originalUrl: result.data.url,
      alias: result.data.alias || undefined,
      expiresAt: result.data.expiresAt || undefined,
    });

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ??
      "http://localhost:3000";

    return NextResponse.json(
      {
        success: true,
        data: {
          code: link.code,
          shortUrl: `${baseUrl}/${link.code}`,
          originalUrl: link.originalUrl,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create link error:", error);

    // Custom alias already exists
    if (
      error instanceof Error &&
      error.message === "CODE_ALREADY_EXISTS"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "CODE_ALREADY_EXISTS",
            message: "This custom alias is already in use.",
          },
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Unable to create short link.",
        },
      },
      { status: 500 }
    );
  }
}

export async function GET() {
    try {
        const links = await prisma.shortLink.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });

        const baseUrl =
            process.env.NEXT_PUBLIC_BASE_URL ??
            "http://localhost:3000";

        return NextResponse.json({
            success: true,
            data: links.map((link) => ({
                code: link.code,
                shortUrl: `${baseUrl}/${link.code}`,
                originalUrl: link.originalUrl,
                clicks: link.clickCount,
                createdAt: link.createdAt,
                expiresAt: link.expiresAt,
            })),
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                error: {
                    code: "INTERNAL_ERROR",
                    message: "Failed to fetch links",
                },
            },
            { status: 500 }
        );
    }
}