import { Entity, Column,ObjectIdColumn, ObjectID } from "typeorm"

@Entity()
export class Equipment {
    @ObjectIdColumn()
    id: ObjectID

    @Column()
    serial: string

    @Column()
    tipo: string

    @Column()
    latitude: string

    @Column()
    longitude: string

    @Column()
    observacoes: string

    @Column()
    foto: []

    @Column()
    status: string

}
