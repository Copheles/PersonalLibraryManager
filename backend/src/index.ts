import 'express-async-errors';
import express, { Application } from 'express';
import { config } from '~/config';
import databaseConnection from '~/setupDatabase';
import Server from '~/setupServer';

class PersonalLibraryManager {
  public run(): void {
    this.loadConfig();
    databaseConnection();
    const app: Application = express();
    const server: Server = new Server(app);
    server.start();
  }

  private loadConfig(): void {
    config.validateConfig();
  }
}

const personalLibraryManger: PersonalLibraryManager = new PersonalLibraryManager();
personalLibraryManger.run();
