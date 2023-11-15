import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { E_DB_TABLES } from '../constants';
import { E_ROLE_ENTITY_KEYS, Role } from './role.entity';
import { Exclude } from 'class-transformer';
import { hashSync } from 'bcrypt';
import {
  E_TEACHER_REQUIREMENT_ENTITY_KEYS,
  TeacherRequirement,
} from './teacher_requirement.entity';

export enum E_USER_ENTITY_KEYS {
  ID = 'id',
  USERNAME = 'username',
  PASSWORD = 'password',
  FIRST_NAME = 'first_name',
  LAST_NAME = 'last_name',
  REFRESH_TOKEN = 'refresh_token',
  ROLES = 'roles',
  TEACHER_REQUIREMENTS = 'teacher_requirements',
}

@Entity({
  name: E_DB_TABLES.USERS,
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  [E_USER_ENTITY_KEYS.ID]: string;

  @Column({
    unique: true,
  })
  [E_USER_ENTITY_KEYS.USERNAME]: string;

  @Column()
  @Exclude()
  [E_USER_ENTITY_KEYS.PASSWORD]: string;

  @Column()
  [E_USER_ENTITY_KEYS.FIRST_NAME]: string;

  @Column()
  [E_USER_ENTITY_KEYS.LAST_NAME]: string;

  @Column({
    nullable: true,
  })
  @Exclude()
  [E_USER_ENTITY_KEYS.REFRESH_TOKEN]: string;

  @ManyToMany(() => Role)
  @JoinTable({
    name: E_DB_TABLES.USER_ROLES,
    joinColumn: {
      name: 'user_id',
      referencedColumnName: E_USER_ENTITY_KEYS.ID,
    },
    inverseJoinColumn: {
      name: 'role_name',
      referencedColumnName: E_ROLE_ENTITY_KEYS.NAME,
    },
  })
  [E_USER_ENTITY_KEYS.ROLES]: Array<Role>;

  @OneToMany(
    () => TeacherRequirement,
    (teacherRequirement) =>
      teacherRequirement[E_TEACHER_REQUIREMENT_ENTITY_KEYS.TEACHER],
  )
  @JoinColumn({ name: E_TEACHER_REQUIREMENT_ENTITY_KEYS.TEACHER_ID })
  [E_USER_ENTITY_KEYS.TEACHER_REQUIREMENTS]: Array<TeacherRequirement>;

  @Exclude()
  private tempPassword: string;

  @AfterLoad()
  private loadTempPassword(): void {
    this.tempPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  private async hashPassword() {
    if (this.tempPassword !== this.password)
      this[E_USER_ENTITY_KEYS.PASSWORD] = hashSync(this.password, 10);
  }
}
