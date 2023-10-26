import { Router } from "express";
import { UserController } from "../controllers";
import { authorization } from "../middlewares";

const routes = Router();

routes.post("/create", authorization, UserController.create); 
routes.get("/list", authorization,UserController.list);
routes.delete("/delete", authorization, UserController.delete);
routes.patch("/update/:id",authorization, UserController.update);
routes.get("/list/:id",authorization, UserController.one);
routes.put("/notEmail",authorization, UserController.notEmail);
routes.put("/notSms",authorization, UserController.notSms);
routes.put("/valNot",authorization, UserController.valNot);
routes.put("/atualizarSenha",authorization, UserController.atualizarSenha);
routes.patch("/updatePerfil/:id",authorization, UserController.updatePerfil);
export default routes;




