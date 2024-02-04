
import { Message } from "node-nats-streaming";
import { subjects,Listener,OrderCreatedEvent } from "@myticketingdev/common";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration-queue";
export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
	readonly subject= subjects.orderCreated;
	queueGroupName=queueGroupName;

	async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
		console.log("OrderCreatedEvent recevied data:",data," msg: ",msg);
		const delay = new Date(data.expiresAt).getTime() - new Date().getTime()
		const {id} = data
		console.log('orderid: ',id,' waiting for milisecs to process job',delay)
		await expirationQueue.add({
			orderId:id
		},{
			delay:delay
		})
		msg.ack()
	}
}