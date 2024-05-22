import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import httpStatus from "http-status";
import cookieParser from "cookie-parser"
import { UserRoutes } from "./app/modules/user/uset.routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { AuthRoutes } from "./app/modules/auth/auth.routes";
import { RequestRoutes } from "./app/modules/request/request.routes";

const app: Application = express();

app.use(cors());

// parser 
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(co)
app.set('query parser', 'simple');

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Blood Donation server is running",
  });
});

app.use('/api', UserRoutes)
app.use('/api', AuthRoutes)
app.use('/api', RequestRoutes)

app.use(globalErrorHandler);

app.use((req:Request, res: Response, next:NextFunction)=> {
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: 'API not found',
        errorDetails: {
            path: req.originalUrl,
            message: 'Your request path is not found'
        }
    })
})

export default app;