import AppDataSource from "../data-source";
import { Request, Response } from 'express';
import { User } from '../entities/User';


class UserController {

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { nome, sobrenome, email, telefone1, telefone2, matricula, cpf, foto, senha } = req.body

      const obj = new User()
      obj.nome = nome
      obj.sobrenome = sobrenome
      obj.email = email
      obj.telefone1 = telefone1
      obj.telefone2 = telefone2
      obj.matricula = matricula
      obj.cpf = cpf
      obj.foto = foto
      obj.senha = senha

      await AppDataSource.manager.save(User, obj)

      return res.json({ message: "Usuario cadastrado com sucesso" })

    } catch (error) {
      return res.json({ error: "Erro ao salvar o Usuario" })

    }
  }

  async list(req: Request, res: Response): Promise<Response> {
    try {
      const usuarios = await AppDataSource.getRepository(User).find()
      return res.json(usuarios)

    } catch (error) {
      return res.json({ error: "Erro ao listar os Usuarios" })
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.body

      const user = AppDataSource.getRepository(User)
      const remove = await user.findOne(id)
      await user.remove(remove)

      return res.json({ message: "Usuario removido com sucesso" })

    } catch (error) {
      return res.json({ error: "Erro ao deletar o Usuario" })
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id, nome, sobrenome, email, telefone1, telefone2, matricula, cpf, foto, senha } = req.body

      const usuario = AppDataSource.getRepository(User)

      const obj = await usuario.findOne(id)

      obj.nome = nome
      obj.sobrenome = sobrenome
      obj.email = email
      obj.telefone1 = telefone1
      obj.telefone2 = telefone2
      obj.matricula = matricula
      obj.cpf = cpf
      obj.foto = foto
      obj.senha = senha

      await usuario.save(obj)
      return res.json(obj)

    } catch (error) {
      return res.json({ error: "Erro ao atualizar o Usuario" })
    }
  }


} export default new UserController();