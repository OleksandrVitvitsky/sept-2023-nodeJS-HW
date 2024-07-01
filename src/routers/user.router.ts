import {Request, Response, Router} from "express";

import {userController} from "../controllers/user.controller";
import {reader, writer} from "../notUse.fs.service";
import {IUser} from "../user.interface";

const router = Router();

router.get("/", userController.getList);
router.post("/", userController.create);
router.post("/", async (req: Request, res: Response) => {
    try {
        const {first_name, last_name, age, phone, login, password, email} =
            req.body;

        const users: IUser[] = await reader();

        const newUser: IUser = {
            id: users[users.length - 1].id + 1,
            first_name,
            last_name,
            age,
            phone,
            login,
            password,
            email,
        };
        users.push(newUser);
        await writer(users);
        res.status(201).json(newUser);
    } catch (e) {
        res.status(400).json(e.message);
    }
});

export const UserRouter = router;
