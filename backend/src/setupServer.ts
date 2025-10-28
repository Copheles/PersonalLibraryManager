import Logger from 'bunyan';
import cookieParser from 'cookie-parser';
import { Application, json, NextFunction, Request, Response, urlencoded } from 'express';
import { config } from '~/config';
import HTTP_STATUS from 'http-status-codes';
import cors from 'cors';
import { CustomError, IErrorResponse, NotFoundError } from '~/shared/helpers/error-handler';
import appRoutes from '~/routes';
import rateLimit from 'express-rate-limit';

const SERVER_PORT = 5000;
const log: Logger = config.createLogger('server');

class Server {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standartMiddleware(this.app);
    this.setUpRoutes(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }

  private setUpRoutes(app: Application): void {
    appRoutes(this.app);
  }

  // Security Middleware
  private securityMiddleware(app: Application): void {
    app.use(cookieParser());
    app.use(
      rateLimit({
        windowMs: 10 * 60 * 1000, // 10 minutes
        max: 100, 
        standardHeaders: true,
        legacyHeaders: false
      })
    );
    app.use(
      cors({
        origin: config.CLIENT_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      })
    );
  }

  // Standard Middleware
  private standartMiddleware(app: Application): void {
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
  }

  // Global Error
  private globalErrorHandler(app: Application): void {
    app.all('*', (req: Request, res: Response, next: NextFunction) => {
      return next(new NotFoundError(`The URL ${req.originalUrl} not found`));
    });

    app.use((error: IErrorResponse, req: Request, res: Response, next: NextFunction) => {
      log.error(error);
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json(error.serializeErrors());
      }

      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error });
    });
  }

  private startServer(app: Application): void {
    app.listen(SERVER_PORT, () => {
      log.info(`Sever is running on port ${SERVER_PORT}`);
    });
  }
}

export default Server;
