import { Entity, Column,ObjectIdColumn, ObjectID } from "typeorm"

@Entity()
export class User {
    @ObjectIdColumn()
    id: ObjectID

    @Column()
    nome: string

    @Column()
    sobrenome: string

    @Column()
    email: string

    @Column()
    telefone1: string

    @Column()
    telefone2: string

    @Column()
    matricula: string

    @Column()
    cpf: string

    @Column()
    foto: []

    @Column()
    senha: string

}
