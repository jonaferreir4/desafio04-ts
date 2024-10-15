import { Router, Request, Response } from 'express'
import { UserController } from './controllers/UserController'
import { LoginController } from './controllers/LoginController'
import { verifyAuth } from './midlleware/verifyAuth'

export const router = Router()

const userController = new UserController()
const loginController = new LoginController()


// Tenho que ver mais direito mas parece que para proteger as rotas tenho que bota o verifyAuth em todas as rotas
// fora a de login
router.post('/user', userController.createUser)
router.get('/user/:user_id', verifyAuth,  userController.getUser)
router.delete('/user/:user_id', verifyAuth, userController.deleteUser)
router.patch('/user/:user_id', verifyAuth, userController.updateUser)
router.post('/login', loginController.login)
