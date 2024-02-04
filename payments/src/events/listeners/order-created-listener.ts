import { Message } from "node-nats-streaming";
import { subjects,Listener,OrderCreatedEvent, NotFoundError } from "@myticketingdev/common";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";
export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
	readonly subject= subjects.orderCreated;
	queueGroupName=queueGroupName;

	async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
		console.log("Payment Service Event recevied data:",data," msg: ",msg);
		const order = Order.build({
			id:data.id,
			price: data.ticket.price,
			status: data.status,
			userId: data.userId,
			version : data.version
		})
		await order.save()
		msg.ack()
	}
}