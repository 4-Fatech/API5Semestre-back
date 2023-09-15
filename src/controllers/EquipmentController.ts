import AppDataSource from "../data-source";
import { Request, Response } from 'express';
import { Equipment } from '../entities/Equipment';


class EquipmentController {

    async create(req: Request, res: Response): Promise<Response> {
        try {
            const { serial, latitude, longitude, observacoes, foto, status } = req.body

            const obj = new Equipment()
            obj.serial = serial
            obj.latitude = latitude
            obj.longitude = longitude
            obj.observacoes = observacoes
            obj.foto = foto
            obj.status = status

            await AppDataSource.manager.save(Equipment, obj)

            return res.json({ message: "Equipamento cadastrado com sucesso" })

        } catch (error) {
            return res.json({ error: "Erro ao salvar o Equipamento" })

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

    async delete(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.body;

            const equipamento = AppDataSource.getRepository(Equipment)
            const remove = await equipamento.findOne(id);
            await equipamento.remove(remove);

            return res.json({ message: "Equipamento removido com sucesso" })

        } catch (error) {
            return res.json({ error: "Erro ao deletar o Equipamento" })
        }
    }

    async update(req: Request, res: Response): Promise<Response> {
        try {
            const { id, serial, latitude, longitude, observacoes, foto, status } = req.body

            const equipamento = AppDataSource.getRepository(Equipment)

            const obj = await equipamento.findOne(id)

            obj.serial = serial
            obj.latitude = latitude
            obj.longitude = longitude
            obj.observacoes = observacoes
            obj.foto = foto
            obj.status = status

            await equipamento.save(obj)
            return res.json(obj)

        } catch (error) {
            return res.json({ error: "Erro ao atualizar o Equipamento" })
        }
    }

} export default new EquipmentController();