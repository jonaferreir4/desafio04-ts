import { UserController } from "./UserController";
import { Request } from 'express'
import { makeMockResponse } from "../__mocks__/mockResponse.mock";
import { makeMockRequest } from "../__mocks__/mockRequest.mock";


const mockUserService = {
    createUser: jest.fn(),
    getUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn()

}

jest.mock("../services/UserService", () => {
    return {
        UserService: jest.fn().mockImplementation(() => {
            return mockUserService
        })
    }
})

describe('UserController', () => {

    const mockResponse = makeMockResponse()
    const userController = new UserController();

    it('Deve adicionar um novo usuário', () => {
        const mockRequest = {
            body: {
                name: 'Nath',
                email: 'nath@test.com',
                password: '12345'
            }
        } as Request
        userController.createUser(mockRequest, mockResponse)
        expect(mockResponse.state.status).toBe(201)
        expect(mockResponse.state.json).toMatchObject({ message: 'Usuário criado' })
    })


    it('Deve verificar caso o usuário não informe o name', () => {
        const mockRequest = {
            body: {
                name: '',
                email: 'nath@test.com',
                password: '1234'
            }

        } as Request
        userController.createUser(mockRequest, mockResponse)
        expect(mockResponse.state.status).toBe(400)
        expect(mockResponse.state.json).toMatchObject({ message: 'Bad request! Name, email e password obrigatórios' })
    })
    it('Deve verificar caso o usuário não informe o email', () => {
        const mockRequest = {
            body: {
                name: 'nath',
                email: '',
                password: '1234'
            }

        } as Request
        userController.createUser(mockRequest, mockResponse)
        expect(mockResponse.state.status).toBe(400)
        expect(mockResponse.state.json).toMatchObject({ message: 'Bad request! Name, email e password obrigatórios' })
    })

    it('Deve verificar caso o usuário não informe o password', () => {
        const mockRequest = {
            body: {
                name: 'nath',
                email: 'nath@test.com',
                password: ''
            }

        } as Request
        userController.createUser(mockRequest, mockResponse)
        expect(mockResponse.state.status).toBe(400)
        expect(mockResponse.state.json).toMatchObject({ message: 'Bad request! Name, email e password obrigatórios' })
    })

    it("Deve retornar os dados do usuário com sucesso", async () => {
        const mockRequest = makeMockRequest({ params: { user_id: "123456" } });

        // Simular que o serviço retorna um usuário válido
        mockUserService.getUser.mockResolvedValue({
            user_id: "123456",
            name: "Jona",
            email: "jona@gmail.com",
        });

        await userController.getUser(mockRequest, mockResponse);

        expect(mockResponse.state.status).toBe(200);
        expect(mockResponse.state.json).toMatchObject({
            user_id: "123456",
            name: "Jona",
            email: "jona@gmail.com",
        });
    });

    it("Deve retornar erro caso o usuário não seja encontrado", async () => {
        const mockRequest = makeMockRequest({ params: { user_id: "2" } });

        // Simular que o serviço não encontrou o usuário (retorna null)
        mockUserService.getUser.mockResolvedValue(null);

        await userController.getUser(mockRequest, mockResponse);

        expect(mockResponse.state.status).toBe(400);
        expect(mockResponse.state.json).toMatchObject({ message: "usuário não encontrado!" });
    });


    it("Deve deletar o usuário pelo id", async () => {
        mockUserService.deleteUser.mockResolvedValue({
            user_id: "123456",
            name: "Jona",
            email: "jona@gmail.com",
        })
        const mockRequest = makeMockRequest({
            params: {
                user_id: '123456'
            }
        })

        await userController.deleteUser(mockRequest, mockResponse)
        expect(mockResponse.state.status).toBe(200)
        expect(mockResponse.state.json).toMatchObject({ message: `Usuário deletado!` })
    })


})
