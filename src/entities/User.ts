import { Entity, Column,ObjectIdColumn, ObjectID,} from "typeorm"
import { IsEmail, IsNotEmpty} from "class-validator";

@Entity()
export class User {
    @ObjectIdColumn()
    id: ObjectID

    @Column()
    @IsNotEmpty({ message: 'O Nome é obrigatório ' })
    nome: string

    @Column()
    @IsNotEmpty({ message: 'O Sobrenome é obrigatório ' })
    sobrenome: string

    @Column({ unique: true })
    @IsEmail({}, { message: 'Para o Email é necessario @ e o .com' })
    @IsNotEmpty({ message: 'O Email é obrigatório ' })
    email: string

    @Column({ unique: true })
    @IsNotEmpty({ message: 'O Telefone é celular ' })
    telefone1: string

    @Column({ nullable: true })
    telefone2: string

    @Column()
    @IsNotEmpty({ message: 'A Matricula é obrigatório  ' })
    matricula: string

    @Column({ unique: true})
    @IsNotEmpty({ message: 'O CPF é obrigatório ' })
    cpf: string

    @Column()
    foto: []

    @Column()
    @IsNotEmpty({ message: 'O Senha é obrigatório ' })
    senha: string



}
