import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {Repository} from "typeorm";

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {

    }

    create(email: string, password: string){
        const user = this.usersRepository.create({email, password});
        return this.usersRepository.save(user);
    }

    findOne(id: number){
        return this.usersRepository.findOne({where: {id}});

    }


}
