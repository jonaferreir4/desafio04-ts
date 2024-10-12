import { EntityManager } from "typeorm"
import { getMockEntityManager, } from "../__mocks__/mockEntityManager.mock"
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

    const updatedUser: Partial<User> = {
        name: 'Teste Atualizado',
        email: "teste_atualizado@gmail.com",
    }

    beforeAll(async() => {
        managerMock = await getMockEntityManager({
            saveReturn: mockUser,
            findOneReturn: mockUser,
        })
        userRepository = new UserRepository(managerMock as EntityManager)
    })
    it("Deve cadastrar um novo usuário no banco", async() => {
        const response = await userRepository.createUser(mockUser)
        expect(managerMock.save).toHaveBeenCalled()
        expect(response).toMatchObject(mockUser)
    })

    it('Deve trazer um usuaário pelo id', async () => {
        const response = await userRepository.getUser(mockUser.user_id)
        expect(managerMock.findOne).toHaveBeenCalled()
        expect(response).toMatchObject(mockUser)
    }

)
    it('Deve trazer um usuaário pelo email e password', async () => {
        const response = await userRepository.getUserByEmailAndPassword(mockUser.email, mockUser.password)
        expect(managerMock.findOne).toHaveBeenCalled()
        expect(response).toMatchObject(mockUser)
    })

    it("Deve atualizar um usuário a partir do id", async () => {
        managerMock.update = jest.fn().mockResolvedValue({ affected: 1 });
        managerMock.findOne = jest.fn().mockResolvedValue({ ...mockUser, ...updatedUser });
        const response = await userRepository.updateUser(mockUser.user_id, updatedUser);
        
        expect(managerMock.update).toHaveBeenCalledWith(User, { user_id: mockUser.user_id }, updatedUser);
        expect(managerMock.findOne).toHaveBeenCalledWith(User, { where: { user_id: mockUser.user_id } });

        expect(response).toMatchObject({ ...mockUser, ...updatedUser });
    });

    it("Deve deletar um usuário a partir do id", async() => {
        managerMock.findOne = jest.fn().mockResolvedValue(mockUser);
        managerMock.remove = jest.fn().mockResolvedValue(mockUser)
        
        const response = await userRepository.deleteUser(mockUser.user_id)
        
        expect(managerMock.findOne).toHaveBeenCalledWith(User, { where: { user_id: mockUser.user_id } });
        expect(managerMock.remove).toHaveBeenCalledWith(mockUser)
        expect(response).toMatchObject(mockUser)
    })



})