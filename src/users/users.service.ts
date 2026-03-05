import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {Repository} from "typeorm";
import {randomBytes, scrypt} from "node:crypto";

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {

    }

    create(email: string, password: string){
        const user = this.usersRepository.create({email, password});
        return this.usersRepository.save(user);
    }

    async signin(email: string, password: string){
        const [user] = await this.findByEmail(email);
        if(!user){
            throw new NotFoundException('User not found');
        }

        const [salt, storedHash] = user.password.split('.');

        const hash = await this.hashPassword(password, salt);

        if(storedHash !== hash){
            throw new BadRequestException('Bad password');
        }

        return user;
    }

    findOne(id: number){
        return this.usersRepository.findOne({where: {id}});

    }

    findByEmail(email: string){
        return this.usersRepository.find({where: {email}});
    }

    async signup(email: string, password: string) {

//Se if email is in use
        const user = await this.findByEmail(email);
        if (user.length) {
            throw new BadRequestException('Email already in use');
        }

//Hash the password by generating a salt and then hashing the password

// 1. Generate the salt
        const salt = randomBytes(8).toString('hex');

// 2. Hash the password using the salt
        const hash = await this.hashPassword(password, salt);

// 3. Join the hash result and the salt
        const result = salt + '.' + hash;

//Create a new user
        return this.create(email, result);
    }


    private async hashPassword(password: string, salt: string): Promise<string> {
        return new Promise((resolve, reject) => {
            scrypt(password, salt, 32, (err, derivedKey) => {
                if (err) {
                    reject(err);
                }
                resolve(derivedKey.toString('hex'));
            });
        });
    }
}
