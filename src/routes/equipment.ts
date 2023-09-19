import { Router } from "express";
import { EquipmentController } from "../controllers";

const routes = Router();

routes.post("/create", EquipmentController.create); 
routes.get("/list", EquipmentController.list);
routes.get("/get/:id", EquipmentController.one);
routes.post("/delete", EquipmentController.delete);
routes.patch("/update", EquipmentController.update);


export default routes;
