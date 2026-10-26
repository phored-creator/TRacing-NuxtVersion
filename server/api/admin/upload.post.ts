import fs from 'node:fs';
import path from 'node:path';

export default defineEventHandler(async (event) => {
  // 1. Проверяем права администратора (наша стандартная защита)
  const session = await getUserSession(event);
  if (!session.user || session.user.role !== 'admin1') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Доступ запрещен. Требуются права администратора.'
    });
  }

  // 2. Читаем загружаемый файл из запроса
  const files = await readMultipartFormData(event);
  if (!files || files.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Файл не был загружен' });
  }

  // Ищем в форме элемент с именем 'file'
  const file = files.find((item) => item.name === 'file');
  if (!file || !file.filename) {
    throw createError({ statusCode: 400, statusMessage: 'Изображение не найдено' });
  }

  try {
    // 3. Создаем папку public/products, если её ещё нет в проекте
    const uploadDir = path.resolve(process.cwd(), 'public/products');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 4. Генерируем уникальное имя (чтобы файлы с именем 1.jpg не перезаписывали друг друга)
    const fileExt = path.extname(file.filename); // получаем расширение (.png, .jpg)
    const uniqueFilename = `${Date.now()}-${Math.floor(Math.random() * 1000)}${fileExt}`;
    const filePath = path.join(uploadDir, uniqueFilename);

    // 5. Записываем файл на жесткий диск
    fs.writeFileSync(filePath, file.data);

    // 6. Возвращаем готовый путь к картинке для записи в MySQL
    return {
      success: true,
      url: `/products/${uniqueFilename}`
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Не удалось сохранить файл на сервере Linux'
    });
  }
});
