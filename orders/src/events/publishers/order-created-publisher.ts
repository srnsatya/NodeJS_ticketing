import { Publisher,OrderCreatedEvent,subjects } from "@myticketingdev/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{

	readonly subject = subjects.orderCreated
}