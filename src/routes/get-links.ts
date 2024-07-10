import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../../lib/prisma";

export const getLinks = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/trips/:tripId/links",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
      },
    },
    async (req, reply) => {
      const { tripId } = req.params;

      const trip = await db.trip.findUnique({
        where: {
          id: tripId,
        },
        include: {
          links: true,
        },
      });

      if (!trip) throw new Error("trip not found");

      return reply.send({ links: trip.links });
    }
  );
};
