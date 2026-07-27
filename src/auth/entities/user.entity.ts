import { IsArray, isArray, IsBoolean, isBoolean, IsString } from "class-validator";
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";


@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id       !: string;

    @Column('text', {
        unique: true
    })
    email    !: string;

    @Column('text', {
        select: false
    })
    password !: string;

    @Column('text')
    fullName !: string;

    @Column('bool', {
        default: true
    })
    isActive !: boolean;

    @Column('text', {
        array: true,
        default: ['user']
    })
    roles    !: string[];

    @BeforeInsert()
    checkFieldsBeforeInsert(){
        this.email = this.email.toLocaleLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate(){
        this.email = this.email.toLocaleLowerCase().trim();
    }
         

}
