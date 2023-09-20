import { Entity, Column, ObjectIdColumn, ObjectID } from "typeorm"
import { IsNotEmpty } from "class-validator";

@Entity()
export class Equipment {
    @ObjectIdColumn()
    id: ObjectID

    @Column({ unique: true})
    @IsNotEmpty({ message: 'O Serial é obrigatório ' })
    serial: string

    @Column()
    @IsNotEmpty({ message: 'O tipo é obrigatório ' })
    tipo: string

    @Column()
    @IsNotEmpty({ message: 'O Latitude é obrigatório ' })
    latitude: string

    @Column()
    @IsNotEmpty({ message: 'O Longitude é obrigatório ' })
    longitude: string

    @Column()
    observacoes: string

    @Column()
    foto: []

    @Column({ default: '1' })
    @IsNotEmpty({ message: 'O Status é obrigatório ' })
    status: string
}