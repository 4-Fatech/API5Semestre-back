import AppDataSource from "../data-source";
import { Request, Response } from 'express';
import { Equipment } from '../entities/Equipment';
import { ObjectID } from 'mongodb'
import { validate } from 'class-validator';
// import { Log } from "../entities/Log"
import { User } from "../entities/User";
import * as bcrypt from "bcrypt";
class EquipmentController {

    // async createLog(req: Request, action: string, value: string, equipment: Equipment, userEmail: string): Promise<void> {

    //     const email = req.cookies.email;

    //     await AppDataSource.getRepository(User).findOne({ where: { email: email.toString() } });

    //     const log = new Log();
    //     log.date = new Date();
    //     log.action = action;
    //     log.value = value;
    //     log.equipmentId = equipment.id;
    //     log.userEmail = email;


    //     await AppDataSource.manager.save(Log, log);
    // }

    async create(req: Request, res: Response): Promise<Response> {
        try {
            const { serial, tipo, modelo, latitude, longitude, observacoes, foto, status } = req.body

            const obj = new Equipment()
            obj.serial = serial
            obj.tipo = tipo
            obj.modelo = modelo
            obj.latitude = latitude
            obj.longitude = longitude
            obj.observacoes = observacoes
            obj.foto = foto
            obj.status = status


            const errors = await validate(obj)


            // await this.createLog(req, 'create', `Equipamento criado: ${obj.serial}`, obj, 'user@example.com');


            if (errors.length === 0) {
                await AppDataSource.manager.save(Equipment, obj)
                return res.json({ message: "Equipamento cadastrado com sucesso" })
            } else {
                return res.json(errors)

            }
        } catch (error) {

            return res.json({ error: error })
        }
    }

    async list(req: Request, res: Response): Promise<Response> {
        try {
            const equipamentos = await AppDataSource.getRepository(Equipment).find()
            return res.json(equipamentos)

        } catch (error) {
            return res.json({ error: "Erro ao listar os Equipamentos" })
        }
    }
    async one(req: Request, res: Response): Promise<Response> {
        try {
            const id = req.params.id
            const equipamentoId = new ObjectID(id)
            const equipamentos = await AppDataSource.getRepository(Equipment).findOne(equipamentoId)
            return res.json(equipamentos)

        } catch (error) {
            console.log(error)
            return res.json({ error: "Erro ao listar os Equipamentos" })
        }
    }

    async delete(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.body;

            const equipamento = AppDataSource.getRepository(Equipment)
            equipamento.remove([])
            const remove = await equipamento.findOne(id);
            await equipamento.remove(remove);

            return res.json({ message: "Equipamento removido com sucesso" })

        } catch (error) {
            return res.json({ error: "Erro ao deletar o Equipamento" })
        }
    }

    async update(req: Request, res: Response): Promise<Response> {
        try {
            const { id, serial, tipo, modelo, latitude, longitude, observacoes, foto, status } = req.body

            const equipamento = AppDataSource.getRepository(Equipment)

            const obj = await equipamento.findOne(id)

            obj.serial = serial
            obj.tipo = tipo
            obj.modelo = modelo
            obj.latitude = latitude
            obj.longitude = longitude
            obj.observacoes = observacoes
            obj.foto = foto
            obj.status = status


            const errors = await validate(obj)
            if (errors.length === 0) {
                await equipamento.save(obj)
                return res.json(obj)
            } else {
                return res.json(errors)
            }

        } catch (error) {
            return res.json({ error: error })
        }
    }

} export default new EquipmentController();
