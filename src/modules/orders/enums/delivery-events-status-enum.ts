export enum EDeliveryEventsStatusEnum {
	CREATED = 'CREATED',
	AVAILABLE = 'AVAILABLE',
	WITHDRAWN = 'WITHDRAWN',
	DELIVERED = 'DELIVERED',
	RETURNED = 'RETURNED',
}

export type DeliveryEventsStatus = keyof typeof EDeliveryEventsStatusEnum
