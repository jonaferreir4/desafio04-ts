import { EntityManager, DeleteResult } from "typeorm";
import { User } from "../entities/User";

export class UserRepository {
    private manager: EntityManager

    constructor(manager: EntityManager) {
        this.manager = manager;
    }
    createUser = async (user: User): Promise<User> => {
        return this.manager.save(user)
    }

    getUser = async (userId: string): Promise<User | null> => {
        return this.manager.findOne(User, {
            where: {
                user_id: userId
            }
        })
    }

    getUserByEmailAndPassword = async (email: string, password: string): Promise<User | null> => {
        return this.manager.findOne(User, {
            where: {
                email,
                password
            }
        })
    }


    updateUser = async (userId: string, updateData: Partial<User>): Promise<User | null> => {
        const user = await this.manager.findOne(User, { where: { user_id: userId } })
        if (user){
            await this.manager.update(User, { user_id: userId }, updateData)
            return user
        }
        return null
    }

    deleteUser = async (userId: string): Promise<User | null> => {
        const user = await this.manager.findOne(User, { where: { user_id: userId } })
        if (user) {
            return await this.manager.remove(user)
        }

        return null
    }


}