import fs from "node:fs/promises";
import path from "node:path";

import {IUser} from "./user.interface";

const filePath = path.join(process.cwd(), "db.json");
const reader = async (): Promise<IUser[]> => {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
};
const writer = async (users: IUser[]): Promise<void> => {
    await fs.writeFile(filePath, JSON.stringify(users));
};
export {reader, writer};
