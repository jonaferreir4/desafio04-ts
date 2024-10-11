import { EntityManager } from "typeorm"
import { getMockEntityManager } from "../__mocks__/mockEntityManager.mock"
import { User } from "../entities/User"
import { UserRepository } from "./UserRepository"

describe('UserRepository', () => {
    let userRepository: UserRepository
    let managerMock: Partial<EntityManager>

    const mockUser: User = {
        user_id: '12345',
        name: 'Teste',
        email: "teste@gmail.com",
        password: '1234'
    }

    beforeAll(async() => {
        managerMock = await getMockEntityManager({
            saveReturn: mockUser
        })
        userRepository = new UserRepository(managerMock as EntityManager)
    })
    it("Deve cadastrar um novo usuário no banco", async() => {
        const response = await userRepository.createUser(mockUser)
        expect(managerMock.save).toHaveBeenCalled()
        expect(response).toMatchObject(mockUser)
    })
})