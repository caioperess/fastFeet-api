import { EUserRole } from '@/modules/users/enums/role-enum'
import { User } from '@/modules/users/infra/typeorm/entities/user'
import { ChildEntity } from 'typeorm'

@ChildEntity(EUserRole.ADMIN)
export class AdminEntity extends User {}
