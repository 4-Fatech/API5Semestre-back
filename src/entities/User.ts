import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    ObjectIdColumn,
    ObjectID,
  } from "typeorm";
  import { IsEmail, IsNotEmpty } from "class-validator";
  import * as bcrypt from "bcrypt";
  
  @Entity()
  export class User {
    @ObjectIdColumn()
    id: ObjectID;
  
    @Column()
    @IsNotEmpty({ message: 'O Nome é obrigatório ' })
    nome: string;
  
    @Column()
    @IsNotEmpty({ message: 'O Sobrenome é obrigatório ' })
    sobrenome: string;
  
    @Column({ unique: true })
    @IsNotEmpty({ message: 'O Email é obrigatório ' })
    @IsEmail({}, { message: 'Para o Email é necessario @ e o .com' })
    email: string;
  
    @Column({ unique: true })
    @IsNotEmpty({ message: 'O Telefone é obrigatório ' })
    telefone1: string;
  
    @Column()
    telefone2: string;
  
    @Column()
    @IsNotEmpty({ message: 'A Matricula é obrigatório  ' })
    matricula: string;
  
    @Column({ unique: true })
    @IsNotEmpty({ message: 'O CPF é obrigatório ' })
    cpf: string;
  
    @Column()
    foto: [];
  
    @Column()
    @IsNotEmpty({ message: 'O Senha é obrigatório ' })
    senha: string;
  
    @Column()
    a2f: string | null;
  
    @Column()
    profile: string;
  
    @BeforeInsert()
    @BeforeUpdate()
    hashpassword() {
      if (this.senha && this.senha.startsWith("$2b$")) {
        // Senha já está hasheada, não faz nada
        return;
      }
      this.senha = bcrypt.hashSync(this.senha, 10);
      if (this.a2f) {
        this.a2f = bcrypt.hashSync(this.a2f, 10);
      }
    }
  }
  