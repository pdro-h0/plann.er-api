import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../../lib/prisma";
import { ClientError } from "../errors/client-error";


export const createLink = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips/:tripId/links",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
        body: z.object({
          title: z.string().min(4),
          url: z.string().url(),
        }),
      },
    },
    async (req, reply) => {
      const { tripId } = req.params;
      const { url, title } = req.body;

      const trip = await db.trip.findUnique({
        where: {
          id: tripId,
        },
      });

      if (!trip) throw new ClientError("trip not found");

      const link = await db.link.create({
        data: {
          title,
          url,
          tripId,
        },
      });

      return reply.status(201).send({ link });
    }
  );
};
