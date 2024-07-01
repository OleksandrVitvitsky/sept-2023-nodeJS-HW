import fs from "node:fs/promises";
import path from "node:path";

import {IUser} from "../user.interface";

const filePath = path.join(process.cwd(), "db.json");

class UserRepository {
    private async reader(): Promise<IUser[]> {
        return JSON.parse(await fs.readFile(filePath, "utf8"));
    }

    private async writer(users: IUser[]): Promise<void> {
        await fs.writeFile(filePath, JSON.stringify(users));
    }

    public async getList(): Promise<IUser[]> {
        return await this.reader();
    }

    public async create(dto: Partial<IUser>): Promise<IUser> {
        const users: IUser[] = await this.reader();
        const newUser: IUser = {
            id: users[users.length - 1].id + 1,
            name: dto.name,
            email: dto.email,
            password: dto.password,
        };
        users.push(newUser);

        await this.writer(users);
        return newUser;
    }
}

export const userRepository = new UserRepository();