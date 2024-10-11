import { UserService } from "./UserService";
import * as jwt from 'jsonwebtoken'

// fazendo mock do endereço de memória
jest.mock("../repositories/UserRepository")
jest.mock("../database", () => {
    initialize: jest.fn()
})

// fazendo mock do endereço de memória
jest.mock('jsonwebtoken')


const mockUserRepository = require("../repositories/UserRepository")

describe('UserService', () => {
    const userService = new UserService(mockUserRepository)
    const mockUser = {
        user_id: '123456',
        name: 'nath',
        email: 'nath@test.com',
        password: '123456'
    }

    it('Deve adicionar um novo usuário', async() => {
        mockUserRepository.createUser = jest.fn().mockImplementation(() => Promise.resolve(mockUser))
        const response = await userService.createUser('nath', 'nath@test.com', "12345");
        expect(mockUserRepository.createUser).toHaveBeenCalled()
        expect(response).toMatchObject({
            user_id: '123456',
            name: 'nath',
            email: 'nath@test.com',
            password: '123456'
        })
    })

    it('Devo retornar um token de usuário', async () => {
        jest.spyOn(userService, 'getAuthenticatedUser').mockImplementation(() => Promise.resolve(mockUser))
        jest.spyOn(jwt, 'sign').mockImplementation(() => 'token')
        const token = await userService.getToken('jona@gmail.com', '123456')
        expect(token).toBe('token')
    })

    it("Deve retornar um erro, caso não encontre um usuário", async () => {
        jest.spyOn(userService, 'getAuthenticatedUser').mockImplementation(() => Promise.resolve(null))
        await expect(userService.getToken('invalid@gmail.com', '1234')).rejects.toThrowError(new Error('Email or Password invalid!'))
    })

    // it('Deve deletar o usuário',  () => {
    //     const mockUser: User = { name: 'nath', email: 'nath@test.com' };
    //     mockDb.push(mockUser);

    //     const mockConsole = jest.spyOn(global.console, 'log'); // Espiona o console.log
    //     const userDeleted = userService.deleteUser(mockUser); 

    //     expect(userDeleted).toMatchObject(mockUser);
    //     expect(mockConsole).toHaveBeenCalledWith(`Usuário deletado: ${mockUser.name} - ${mockUser.email}`);
    // })

});

