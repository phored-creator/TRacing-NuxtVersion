import { db } from '../../db';
import { categories } from '../../db/schema';

export default defineEventHandler(async (event) => {
  // 1. Проверяем права администратора
  const session = await getUserSession(event);
  if (!session.user || session.user.role !== 'admin1') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Доступ запрещен. Требуются права администратора.'
    });
  }

  // 2. Читаем данные из формы
  const body = await readBody(event);
  const { name, slug } = body;

  if (!name || !slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Пожалуйста, заполните название и системное имя (slug)'
    });
  }

  try {
    // 3. Записываем новую категорию в MySQL
    await db.insert(categories).values({
      name,
      slug: slug.toLowerCase().trim() // приводим к нижнему регистру для надежности путей
    });

    return { success: true, message: 'Категория успешно создана!' };
  } catch (error: any) {
    // Перехват ошибки дубликата (у нас на поле slug стоит уникальный индекс)
    if (error.code === 'ER_DUP_ENTRY') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Категория с таким системным именем (slug) уже существует'
      });
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Ошибка при сохранении категории в базу данных'
    });
  }
});
