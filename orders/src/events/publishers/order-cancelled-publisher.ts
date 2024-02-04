import { Publisher,OrderCancelledEvent,subjects } from "@myticketingdev/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{

	readonly subject = subjects.orderCancelled
}