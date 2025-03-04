import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../../lib/prisma";
import { ClientError } from "../errors/client-error";


export const getTripDetails = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/trips/:tripId",
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
      });

      if (!trip) throw new ClientError("trip not found");

      return reply.send({ trip });
    }
  );
};
