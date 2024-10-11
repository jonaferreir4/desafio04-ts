import { sign } from "jsonwebtoken";
import { LoginController } from "../controllers/LoginController";
import { AppDataSource } from "../database";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository"
import { DeleteResult } from "typeorm";

export class UserService {
    private userRepository: UserRepository;

    constructor ( 
        userRepository = new UserRepository(AppDataSource.manager)
     ) {
        this.userRepository = userRepository

    }

    createUser = async (name: string, email: string, password: string): Promise<User> => {
        const user = new User(name, email, password)
        return this.userRepository.createUser(user)

    }

    getUser = async (userId: string): Promise<User | null> => {
        return this.userRepository.getUser(userId)
    }

    getAuthenticatedUser = async (email: string, password: string): Promise<User | null> => {
        return this.userRepository.getUserByEmailAndPassword(email, password)
    }

    getToken = async (email: string, password: string): Promise<string> => {
        const user = await this.getAuthenticatedUser(email, password)

        if(!user) {
            throw new Error('Email or Password invalid!')
        }
        
        const tokenData = {
             name: user?.name,
             email: user?.email
        }
        const tokenKey = '123456789'
        const tokenOptions = {
            subject: user?.user_id
        }

        const token = sign(tokenData, tokenKey, tokenOptions)

        return token
    
    }

    updataUser = async(userId: string, updateData: Partial<User>): Promise<User | null> =>  {
        return this.userRepository.updateUser(userId, updateData)
    }

    deleteUser = async (userId: string): Promise<User | null > => {
       return await this.userRepository.deleteUser(userId)
    }
}

