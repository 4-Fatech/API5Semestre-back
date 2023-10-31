import AppDataSource from "../data-source";
import { Request, Response } from 'express';
import { User } from '../entities/User';
import { ObjectID } from 'mongodb'
import { validate } from 'class-validator';
import 'dotenv/config';
import * as bcrypt from "bcrypt";
import { verify, sign } from 'jsonwebtoken';
import { authAdmin } from "../middlewares";


class UserController {
  async keepUserLoggedIn(req: Request, res: Response) {
    try {
      const token = req.cookies.jwt; // Obtém o token do cookie

      if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
      }

      // Verifica se o token é válido
      verify(token, '@tokenJWT', (err, decoded) => {
        if (err) {
          return res.status(401).json({ error: 'Token inválido' });
        }

        // Se o token for válido, você pode gerar um novo token com uma nova expiração
        const newToken = sign(decoded, '@tokenJWT', { expiresIn: '1h' });

        // Atualize o cookie com o novo token
        res.cookie('jwt', newToken);

        return res.json({ success: true, token: newToken });
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao manter o usuário logado' });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
        const { nome, sobrenome, email, telefone1, telefone2, matricula, cpf, foto, senha, profile } = req.body;

        // Use o middleware authAdmin para verificar se o usuário é um administrador
        authAdmin(req, res, async (error) => { // Marque a função como async
            if (error) {
                return res.status(401).json({ error: "Apenas administradores podem criar usuários." });
            }

            const obj = new User();
            obj.nome = nome;
            obj.sobrenome = sobrenome;
            obj.email = email;
            obj.telefone1 = telefone1;
            obj.telefone2 = telefone2;
            obj.matricula = matricula;
            obj.cpf = cpf;
            obj.foto = foto;
            obj.senha = senha;
            obj.profile = profile;

            const errors = await validate(obj);
            if (errors.length === 0) {
                await AppDataSource.manager.save(User, obj);
                return res.json({ message: "Usuário cadastrado com sucesso" });
            } else {
                return res.json(errors);
            }
        });
    } catch (error) {
        return res.json({ error: error });
    }
}

async list(req: Request, res: Response): Promise<Response> {
  try {
      // Use a middleware de autenticação de administrador para verificar se o usuário é um administrador
      authAdmin(req, res, async (adminError) => {
          if (adminError) {
              return res.status(401).json({ error: "Apenas administradores podem listar usuários" });
          }

          // Se chegou até aqui, o usuário é um administrador
          const usuarios = await AppDataSource.getRepository(User).find();
          return res.json(usuarios);
      });
  } catch (error) {
      return res.json({ error: "Erro ao listar os usuários" });
  }
}

async delete(req: Request, res: Response): Promise<Response> {
  try {
      // Use a middleware de autenticação de administrador para verificar se o usuário é um administrador
      authAdmin(req, res, async (adminError) => {
          if (adminError) {
              return res.status(401).json({ error: "Apenas administradores podem remover usuários" });
          }

          const { id } = req.body;
          const user = AppDataSource.getRepository(User);
          const remove = await user.findOne(id);

          if (!remove) {
              return res.status(404).json({ error: "Usuário não encontrado" });
          }

          await user.remove(remove);
          return res.json({ message: "Usuário removido com sucesso" });
      });
  } catch (error) {
      return res.json({ error: "Erro ao deletar o usuário" });
  }
}


async update(req: Request, res: Response): Promise<Response> {
  try {
      // Use a middleware de autenticação de administrador para verificar se o usuário é um administrador
      authAdmin(req, res, async (adminError) => {
          if (adminError) {
              return res.status(401).json({ error: "Apenas administradores podem atualizar informações de usuários" });
          }

          const id = req.params.id;
          const { nome, sobrenome, email, telefone1, telefone2, matricula, cpf, foto, profile } = req.body;

          const userid = new ObjectID(id);
          const usuario = AppDataSource.getRepository(User);
          const obj = await usuario.findOne(userid);

          if (!obj) {
              return res.status(404).json({ error: "Usuário não encontrado" });
          }

          obj.nome = nome;
          obj.sobrenome = sobrenome;
          obj.email = email;
          obj.telefone1 = telefone1;
          obj.telefone2 = telefone2;
          obj.matricula = matricula;
          obj.cpf = cpf;
          obj.foto = foto;
          obj.profile = profile;

          const errors = await validate(obj);
          if (errors.length === 0) {
              await usuario.save(obj);
              return res.json(obj);
          } else {
              return res.json(errors);
          }
      });
  } catch (error) {
      return res.json({ error: "Erro ao atualizar as informações do usuário" });
  }
}

  async updatePerfil(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id;

      const { nome, sobrenome, email, telefone1, telefone2, matricula, cpf, foto, senha} = req.body

    

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

  public async notEmail(req: Request, res: Response): Promise<Response> {
    try {
      const { email } = req.body

      const userRepository = AppDataSource.getRepository(User)
      const user = await userRepository.findOne({ where: { email } })

      if (!user) {
        return res.json({ error: "Email não encontrado." })
      }

      const code = Math.floor(100000 + Math.random() * 900000)
      // console.log(code)


      user.a2f = code.toString()

      await userRepository.save(user)

      const conteudoEmail = {
        service_id: `${process.env.SERVICE_ID}`,
        template_id: `${process.env.TEMPLATE_ID}`,
        user_id: `${process.env.PUBLIC_KEY}`,
        template_params: {
          email: email,
          code: code
        }
      };
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(conteudoEmail)
      });

      if (response.ok) {
        console.log('SUCCESS!', response.status, response.statusText);
        return res.json({ message: 'Código de autenticação enviado com sucesso.' });
      } else {
        console.log('FAILED...', response.status, response.statusText);
        return res.status(response.status).json({ error: 'Erro ao enviar o Código de autenticação ' });
      }

    } catch (error) {
      return res.json({ error: error })
    }
  }

  public async notSms(req: Request, res: Response): Promise<Response> {
    try {
      const { telefone1 } = req.body

      const userRepository = AppDataSource.getRepository(User)
      const user = await userRepository.findOne({ where: { telefone1 } })
      console.log(user)

      if (!user) {
        return res.json({ error: "Telefone não registrado." })
      }

      const code = Math.floor(100000 + Math.random() * 900000)
      console.log(code)

      user.a2f  = code.toString()

      await userRepository.save(user)

      const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

      client.messages
        .create({
          body: `Imagem - Seu código de verificação é:${code}`,
          from: `${process.env.TWILIO_PHONE_NUMBER}`,
          to: `${telefone1}`
        })
        .then(message => console.log(message.sid));
        return res.json({ message: 'Código de autenticação enviado com sucesso.' });

    } catch (error) {
      console.log(error)
      return res.json({ error: error })
    }
  }

  public async valNot(req: Request, res: Response): Promise<Response> {
    try {
      const { email, telefone1, code } = req.body

      const cond = email ? { email } : { telefone1 };
      

      const userRepository = AppDataSource.getRepository(User)
      const user = await userRepository.findOne({ where: cond });
  
      if (!user) {
        return res.json({ error: "Precisa conter o Email ou o Telefone. " })
      }
      if (!code) {
        return res.json({ error: "Codigo não encontrado." })
      }
      const valid = await bcrypt.compare(code, user.a2f); 


      if (!valid){
        return res.json({ error: "Codigo incorreto." })
      }
      return res.json({ message: "Código Válido." });

    } catch (error) {
      return res.json({ error: error })

    }
  }
  public async atualizarSenha(req: Request, res: Response): Promise<Response> {
    try {
      const { email, telefone1, senha } = req.body

      const cond = email ? { email } : { telefone1 };
      

      const userRepository = AppDataSource.getRepository(User)
      const user = await userRepository.findOne({ where: cond });
  
      if (!user) {
        return res.json({ error: "Erro ao atualizar senha. " })
      }
      
      user.senha = senha;

      await userRepository.save(user);

      return res.json({ message: "Senha atualizada com sucesso!." });

    } catch (error) {
      return res.json({ error: error })

    }
  }

} export default new UserController();