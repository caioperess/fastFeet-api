import { ChildEntity } from 'typeorm'
import { EUserRole } from '@/modules/users/enums/role-enum'
import { User } from '@/modules/users/infra/typeorm/entities/user'

@ChildEntity(EUserRole.DELIVERYMAN)
export class Deliveryman extends User {}
