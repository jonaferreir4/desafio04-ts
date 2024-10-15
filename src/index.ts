import "reflect-metadata"
import express, { Request, Response } from 'express';
import cors from 'cors';
import { router } from './routes';
import { AppDataSource } from "./database";

const server = express();

server.use(cors())
server.use(express.json())
server.use(router)

server.get('/', (request: Request, response: Response) => {
    return response.status(200).json({ message: 'DioBank API' })
})

server.listen(5000, () => console.log('Server on'))
