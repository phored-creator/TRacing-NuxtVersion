import { db } from '../db';
import { categories } from '../db/schema';

export default defineEventHandler(async (event) => {
  try {
    const allCategories = await db.select().from(categories);
    return allCategories;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Не удалось загрузить список категорий'
    });
  }
});
