import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { hashValue } from '~/shared/helpers/bcrypt';
import UserModel, { UserDocument } from '~/features/user/user.model';
import BookModel, { BookDocument, BookStatus } from '~/features/book/book.model';
import { config } from '~/config';
import Logger from 'bunyan';

dotenv.config();
const log: Logger = config.createLogger('seeder');

const MONGO_URI = config.DATABASE_URL || 'mongodb://127.0.0.1:27017/personal-library-management';

async function connectDB() {
  await mongoose.connect(MONGO_URI);
  log.info('MongoDB connected');
}

async function seedUsers(): Promise<UserDocument[]> {
  await UserModel.deleteMany({});

  const usersData = [];
  for (let i = 1; i <= 20; i++) {
    const hashedPassword = await hashValue('123456');
    usersData.push({
      email: `user${i}@example.com`,
      password: hashedPassword
    });
  }

  const users = await UserModel.insertMany(usersData);
  log.info(`Seeded ${users.length} users`);
  return users;
}

async function seedBooks(users: UserDocument[]): Promise<BookDocument[]> {
  await BookModel.deleteMany({});

  const booksData = [];
  const statuses = [BookStatus.READING, BookStatus.COMPLETED, BookStatus.WISHLIST];

  for (let i = 1; i <= 100; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];

    booksData.push({
      title: `Book Title ${i}`,
      author: `Author ${Math.ceil(i / 2)}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      rating: Math.floor(Math.random() * 6), // 0–5
      review: `This is a review for book ${i}`,
      ownerId: randomUser._id as mongoose.Types.ObjectId
    });
  }

  const books = await BookModel.insertMany(booksData);
  log.info(`Seeded ${books.length} books`);
  return books as BookDocument[];
}

async function runSeeder() {
  try {
    await connectDB();

    const users = await seedUsers();
    await seedBooks(users);

    log.info('Database seeding completed!');
    process.exit(0);
  } catch (error) {
    log.error('Seeding error:', error);
    process.exit(1);
  }
}

runSeeder();
