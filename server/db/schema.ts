import { mysqlTable, int, varchar, timestamp, text} from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).default('user').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const categories = mysqlTable('categories', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(), // Системное имя для ссылки/фильтра (например: "tires", "wheels")
});

export const products = mysqlTable('products', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(), // Название товара
  
  category: int('category_id').references(() => categories.id).notNull(), 
  
  price: varchar('price', { length: 50 }).notNull(), // Цена (например: "14 500 ₽")
  image: varchar('image', { length: 255 }).notNull(), // Путь к картинке (например: "/images/formula-e.jpg")
  brand: varchar('brand', { length: 100 }), // Бренд (например: Michelin)
  season: varchar('season', { length: 50 }), // Сезон (Летние / Зимние)
  diameter: varchar('diameter', { length: 50 }), // Диаметр (R17, R18, R19)
  country: varchar('country', { length: 100 }), // Страна производства
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const orders = mysqlTable('orders', {
  id: int('id').primaryKey().autoincrement(),
  
  // Связь с пользователем (если гость — может быть null, если авторизован — запишем его ID)
  userId: int('user_id').references(() => users.id),
  
  // Связь с товаром
  productId: int('product_id').references(() => products.id).notNull(),
  
  clientName: varchar('client_name', { length: 255 }).notNull(),
  clientPhone: varchar('client_phone', { length: 50 }).notNull(),
  clientComment: text('client_comment'),
  
  // Статус заявки (например: 'new', 'in_progress', 'completed')
  status: varchar('status', { length: 50 }).default('new').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});



