export enum EOrderStatusEnum {
	PENDING = 'PENDING',
	AVAILABLE = 'AVAILABLE',
	WITHDRAWN = 'WITHDRAWN',
	DELIVERED = 'DELIVERED',
	RETURNED = 'RETURNED',
}

export type OrderStatus = keyof typeof EOrderStatusEnum
