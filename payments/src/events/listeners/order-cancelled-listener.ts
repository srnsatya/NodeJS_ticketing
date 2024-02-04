import { Message } from "node-nats-streaming";
import { subjects,Listener,OrderCancelledEvent, NotFoundError, OrderStatus } from "@myticketingdev/common";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";
export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
	readonly subject= subjects.orderCancelled;
	queueGroupName=queueGroupName;

	async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
		console.log("payment service cancel Event recevied data:",data," msg: ",msg);
		const {id} = data.ticket
		const order = await Order.findOne({
			_id: data.id,
			version: data.version-1
		})
		if(!order){
			console.error("order not found")
			throw new Error('order not found')
		}
		order.set({ status: OrderStatus.Cancelled});
		//ticket.set({title,price})
		await order.save()
		console.log("order updated",order);
	
		msg.ack()
	}
}