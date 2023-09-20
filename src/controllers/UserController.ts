import AppDataSource from "../data-source";
import { Request, Response } from 'express';
import { User } from '../entities/User';
import { ObjectID } from 'mongodb'
import { validate } from 'class-validator';


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

      const errors = await validate(obj)
      if (errors.length === 0) {
        await AppDataSource.manager.save(User, obj)
        return res.json({ message: "Usuario cadastrado com sucesso" })
      } else {
        return res.json(errors)

      }
    } catch (error) {

      return res.json({ error: error })
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
      const id = req.params.id;

      const { nome, sobrenome, email, telefone1, telefone2, matricula, cpf, foto, senha } = req.body

      const userid = new ObjectID(id)

      const usuario = AppDataSource.getRepository(User)

      const obj = await usuario.findOne(userid)

      obj.nome = nome
      obj.sobrenome = sobrenome
      obj.email = email
      obj.telefone1 = telefone1
      obj.telefone2 = telefone2
      obj.matricula = matricula
      obj.cpf = cpf
      obj.foto = foto
      obj.senha = senha

      const errors = await validate(obj)
      if (errors.length === 0) {
        await usuario.save(obj)
        return res.json(obj)
      } else {
        return res.json(errors)
      }

    } catch (error) {
      return res.json({ error: error })
    }
  }


  public async one(req: Request, res: Response): Promise<Response> {
    const id = req.params.id;

    const userid = new ObjectID(id)

    try {
      const usuario = await AppDataSource.getRepository(User).findOne(userid)

      return res.json(usuario);
    } catch (error) {
      console.error(error);
      return res.json({ error: 'Erro ao buscar o Usuario' });
    }
  }


} export default new UserController();