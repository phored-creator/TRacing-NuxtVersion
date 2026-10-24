import { mysqlTable, int, varchar, timestamp } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).default('user').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const products = mysqlTable('products', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(), // Название товара
  category: varchar('category', { length: 100 }).notNull(), // Категория (например: tires, wheels)
  price: varchar('price', { length: 50 }).notNull(), // Цена (например: "14 500 ₽")
  image: varchar('image', { length: 255 }).notNull(), // Путь к картинке (например: "/images/formula-e.jpg")
  brand: varchar('brand', { length: 100 }), // Бренд (например: Michelin)
  season: varchar('season', { length: 50 }), // Сезон (Летние / Зимние)
  diameter: varchar('diameter', { length: 50 }), // Диаметр (R17, R18, R19)
  country: varchar('country', { length: 100 }), // Страна производства
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
