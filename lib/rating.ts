import { db } from './db';

export const getAverageRating = async (id: string) => {
  const result = await db.rating.aggregate({
    _avg: {
      rating: true,
    },
    where: {
      entityId: id,
    },
  });

  const averageRating =
    Math.round((result._avg.rating || 0 + Number.EPSILON) * 100) / 100;

  return averageRating;
};
