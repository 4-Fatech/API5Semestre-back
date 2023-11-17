import AppDataSource from "../data-source";
import { Request, Response } from 'express';
import { Equipment } from '../entities/Equipment';
import { ObjectID } from 'mongodb'
import { validate } from 'class-validator';
import { Log } from "../entities/Log"

export async function createEquipmentLog(action: string, userEmail?: string, equipmentId?: string, details?: string[]): Promise<void> {
    const log = new Log();
    log.date = new Date();
    log.action = action;
    log.equipmentId = equipmentId;
    log.userEmail = userEmail || null;
    log.details = details || null;

    const newLog: any = await AppDataSource.manager.save(Log, log).catch((e) => { console.log(e) })
    return newLog;
}

class EquipmentController {

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

            if (errors.length === 0) {
                await AppDataSource.manager.save(Equipment, obj)

                const userEmail = res.locals.email
                await createEquipmentLog('Create', userEmail, obj.id.toHexString());

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

            const userEmail = res.locals.email
            await createEquipmentLog('Delete', userEmail, id);

            return res.json({ message: "Equipamento removido com sucesso" })

        } catch (error) {
            return res.json({ error: "Erro ao deletar o Equipamento" })
        }
    }

    async update(req: Request, res: Response): Promise<Response> {
        try {
            const { id, serial, tipo, modelo, latitude, longitude, observacoes, foto, status } = req.body;

            const equipamento = AppDataSource.getRepository(Equipment);
            const obj = await equipamento.findOne(id);
            const old = { ...obj };

            obj.serial = serial;
            obj.tipo = tipo;
            obj.modelo = modelo;
            obj.latitude = latitude;
            obj.longitude = longitude;
            obj.observacoes = observacoes;
            obj.foto = foto;
            obj.status = status;

            const errors = await validate(obj);

            if (errors.length === 0) {
                await equipamento.save(obj);

                const userEmail = res.locals.email;
                const details: string[] = [];

                let logTitle = '';
                let logDetail = '';

                if (old.status === 0 && obj.status === 1) {
                    logTitle = 'Ativado';
                    logDetail = 'Equipamento ativado';
                } else if (old.status === 1 && obj.status === 0) {
                    logTitle = 'Desativado';
                    logDetail = 'Equipamento inativo';
                } else {
                    for (const [column, value] of Object.entries(obj)) {
                        if (old[column] !== value) {
                            const formattedColumn = column.charAt(0).toUpperCase() + column.slice(1);
                            if (column === 'foto') {
                                details.push('Foto Atualizada');
                            } else {
                                details.push(`${formattedColumn}: ${old[column]} => ${value}`);
                            }
                        }
                    }
                }

                if (logTitle && logDetail) {
                    await createEquipmentLog(logTitle, userEmail, obj.id.toHexString(), [logDetail]);
                } else if (details.length > 0) {
                    await createEquipmentLog('Update', userEmail, obj.id.toHexString(), details);
                }

                return res.json(obj);
            } else {
                return res.json(errors);
            }
        } catch (error) {
            return res.json({ error: error });
        }
    }



    async getLogs(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;

            const equipmentId = id;

            if (!id) {
                return res.json({ error: "ID do Equipamento Não Fornecido." });
            }

            const logs = await AppDataSource.getRepository(Log).find({
                where: { equipmentId },
                order: { date: 'ASC' },
            });

            return res.json(logs);
        } catch (error) {
            return res.json({ error: error.message });
        }
    }

} export default new EquipmentController();
