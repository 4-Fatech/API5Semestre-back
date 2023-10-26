import { Router } from "express";
import { EquipmentController } from "../controllers";
import { authorization } from "../middlewares";

const routes = Router();

routes.post("/create",authorization, EquipmentController.create); 
routes.get("/list",authorization, EquipmentController.list);
routes.get("/get/:id",authorization, EquipmentController.one);
routes.post("/delete",authorization, EquipmentController.delete);
routes.patch("/update",authorization, EquipmentController.update);


export default routes;
