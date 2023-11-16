import { Entity, ObjectIdColumn, ObjectID, Column } from 'typeorm';

@Entity()
export class Log {
    @ObjectIdColumn()
    id: ObjectID

    @Column()
    date: Date

    @Column()
    action: string

    @ObjectIdColumn()
    equipmentId: string

    @Column()
    userEmail: string

    @Column()
    details: string[]
}