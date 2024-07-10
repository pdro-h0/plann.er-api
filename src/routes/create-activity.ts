import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../../lib/prisma";
import { dayjs } from "../../lib/dayjs";

export const createActivity = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips/:tripId/activities",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
        body: z.object({
          title: z.string().min(4),
          occursAt: z.coerce.date(),
        }),
      },
    },
    async (req, reply) => {
      const { tripId } = req.params;
      const { occursAt, title } = req.body;

      const trip = await db.trip.findUnique({
        where: {
          id: tripId,
        },
      });

      if (!trip) throw new Error("trip not found");

      if (
        dayjs(occursAt).isBefore(trip.startsAt) ||
        dayjs(occursAt).isAfter(trip.endsAt)
      ) {
        throw new Error("invalid activity data");
      }

      const activity = await db.acticity.create({
        data: {
          title,
          occursAt,
          tripId,
        },
      });

      return reply.status(201).send({ activity });
    }
  );
};
