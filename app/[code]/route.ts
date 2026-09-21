import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  context: {
    params: Promise<{ code: string }>;
  }
) {
  const { code } = await context.params;

  const link = await prisma.shortLink.findUnique({
    where: {
      code,
    },
  });

  if (!link) {
    return new Response(
      "Short link not found",
      {
        status: 404,
      }
    );
  }

  if (
    link.expiresAt &&
    link.expiresAt <= new Date()
  ) {
    return new Response(
      "This short link has expired",
      {
        status: 410,
      }
    );
  }

  await prisma.shortLink.update({
    where: {
      id: link.id,
    },
    data: {
      clickCount: {
        increment: 1,
      },
    },
  });

  return Response.redirect(
    link.originalUrl,
    302
  );
}