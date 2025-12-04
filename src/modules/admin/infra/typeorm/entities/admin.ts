import { ChildEntity } from 'typeorm'
import { EUserRole } from '@/modules/users/enums/role-enum'
import { User } from '@/modules/users/infra/typeorm/entities/user'

@ChildEntity(EUserRole.ADMIN)
export class AdminEntity extends User {}
