import { Router } from "express";
import { UserController } from "../controllers";

const routes = Router();

routes.post("/create", UserController.create); 
routes.get("/list", UserController.list);
routes.delete("/delete", UserController.delete);
routes.patch("/update", UserController.update);


export default routes;




