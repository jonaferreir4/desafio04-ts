import { UserController } from "./UserController";
import { UserService, User } from '../services/UserService'
import { Request } from 'express'
import { makeMockResponse } from "../__mocks__/mockResponse.mock";
import { makeMockRequest } from "../__mocks__/mockRequest.mock";

describe('UserController', () => {
    const mockUserService: Partial<UserService> = {
        createUser: jest.fn(),
        getAllUsers: jest.fn(),
        deleteUser: jest.fn()
    }
    
    const userController = new UserController(mockUserService as UserService);

    it('Deve adicionar um novo usuário', () => {
        const mockRequest = {
            body: {
                name: 'Nath',
                email: 'nath@test.com'
            }
        } as Request
        const mockResponse = makeMockResponse()
        userController.createUser(mockRequest, mockResponse)
        expect(mockResponse.state.status).toBe(201)
        expect(mockResponse.state.json).toMatchObject({ message: 'Usuário criado' })
    })


    it('Deve verificar caso o usuário não informe o name', () =>{
        const mockRequest = {
            body: {
                name: '',
                email: 'nath@test.com'
            }

        } as Request
        const mockResponse = makeMockResponse()
        userController.createUser(mockRequest, mockResponse)
        expect(mockResponse.state.status).toBe(400)
        expect(mockResponse.state.json).toMatchObject({ message: 'Bad request! Name obrigatório'})
    })

    it('Deve verificar caso o usuário não informe o email', () =>{
        const mockRequest = {
            body: {
                name: 'Nath',
                email: ''
            }

        } as Request
        const mockResponse = makeMockResponse()
        userController.createUser(mockRequest, mockResponse)
        expect(mockResponse.state.status).toBe(400)
        expect(mockResponse.state.json).toMatchObject({ message: 'Bad request! Email obrigatório'})
    })

    it('Deve trazer todos os usuários', () => {

        const mockUsers = [
            { name: 'User One', email: 'user1@test.com'},
            { name: 'User Two', email: 'user1@test.com'}
          ];

        (mockUserService.getAllUsers as jest.Mock).mockReturnValue(mockUsers);
        const mockRequest = makeMockRequest({})
        const mockResponse = makeMockResponse()
        userController.getAllUsers(mockRequest, mockResponse)
        expect(mockResponse.state.status).toBe(200)
        expect(mockResponse.state.json).toEqual(mockUsers)
    })


    it('Deve deletar o usuário', () => {
        const mockRequest = makeMockRequest({}) as Request
        mockRequest.body = { name: "Joana", email: "joana@dio.com" };
        
        (mockUserService.deleteUser as jest.Mock).mockReturnValue(true)

        const mockResponse = makeMockResponse()
        userController.deleteUser(mockRequest, mockResponse)
        expect(mockResponse.state.status).toBe(200)
        expect(mockResponse.state.json).toMatchObject({ message: `Usuário ${mockRequest.body.name} deletado com sucesso!` })
    })

    it('Deve retornar erro 404 se o usuário não for encontrado', () => {
        const mockRequest = {
            body: {
                name: 'Inexistente',
                email: 'inexistente@test.com'
            }
        } as Request

        const mockResponse = makeMockResponse()
        ;(mockUserService.deleteUser as jest.Mock).mockReturnValue(false) // Simula a deleção falha (usuário não encontrado)

        userController.deleteUser(mockRequest, mockResponse)

        expect(mockResponse.state.status).toBe(404)
        expect(mockResponse.state.json).toMatchObject({ message: 'Usuário não encontrado!' })
    })
})
