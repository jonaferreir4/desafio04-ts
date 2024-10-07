import { User, UserService } from "./UserService";

describe('UserService', () => {
    const mockDb: User[] = []
    const userService = new UserService(mockDb);

    it('Deve adicionar um novo usuário', () => {
        const mockConsole = jest.spyOn(global.console, 'log')
        userService.createUser('nath', 'nath@test.com');
        expect(mockConsole).toHaveBeenCalledWith('DB atualizado', mockDb)
    })

    it('Deve deletar o usuário',  () => {
        const mockUser: User = { name: 'nath', email: 'nath@test.com' };
        mockDb.push(mockUser);

        const mockConsole = jest.spyOn(global.console, 'log'); // Espiona o console.log
        const userDeleted = userService.deleteUser(mockUser); 

        expect(userDeleted).toMatchObject(mockUser);
        expect(mockConsole).toHaveBeenCalledWith(`Usuário deletado: ${mockUser.name} - ${mockUser.email}`);
    })

});

