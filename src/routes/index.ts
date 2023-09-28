import { Router, Request, Response } from "express";
import user from "./user";
import equipment from "./equipment"
import loginRouter from "./login";


const routes = Router()

routes.use("/user", user);
routes.use("/equipment", equipment);
routes.use("/login", loginRouter);


routes.use((req: Request, res: Response) => res.json({ error: "Requisição desconhecida" }));

export default routes;
