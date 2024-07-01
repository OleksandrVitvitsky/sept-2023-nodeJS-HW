import express, {Request, Response} from "express";

import {reader, writer} from "./notUse.fs.service";
import {UserRouter} from "./routers/user.router";
import {IUser} from "./user.interface";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// app.get("/", (req: Request, res: Response): void => {
//   res.send("Hello Sasha!!!");
// });
app.use("/users", UserRouter);

//app.post("/users");

app.get("/users/:userId", async (req: Request, res: Response) => {
    // console.log(req.params);
    // console.log(req.query);
    try {
        const users: IUser[] = await reader();
        const userId: number = Number(req.params.userId);

        const user: IUser = users.find((user) => user.id === userId);
        if (!user) {
            throw new Error("User not found");
            //  return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (e) {
        res.status(400).json(e.message);
    }
});
app.delete("/users/:userId", async (req: Request, res: Response) => {
    // console.log(req.params);
    // console.log(req.query)
    try {
        const users: IUser[] = await reader();
        const userId: number = Number(req.params.userId);
        if (!userId) {
            throw new Error("User ID not found");
        }
        const index: number = users.findIndex((user) => user.id === userId);
        if (index === -1) {
            throw new Error("User not found");
        }
        users.splice(index, 1);
        await writer(users);
        res.send("User deleted");
    } catch (e) {
        res.status(400).json(e.message);
    }
});
app.put("/users/:userId", async (req: Request, res: Response) => {
    try {
        const {id, first_name, last_name, age, phone, login, password, email} =
            req.body;
        const users: IUser[] = await reader();
        const userId: number = Number(req.params.userId);
        if (!userId) {
            throw new Error("User ID not found");
        }
        const index: number = users.findIndex((user) => user.id === userId);
        if (index === -1) {
            throw new Error("User not found");
        }
        users[index] = {
            id,
            first_name,
            last_name,
            age,
            phone,
            login,
            password,
            email,
        };
        await writer(users);
        res.status(201).json(users[index]);
    } catch (e) {
        res.status(400).json(e.message);
    }
});

//const PORT : number|string = process.env.PORT ?? 3000;
const PORT: number = 3000;
const HOST: string = "0.0.0.0";
app.listen(PORT, HOST, () => {
    console.log(`Server is running at http://${HOST}:${PORT}`);
});
