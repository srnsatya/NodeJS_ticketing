import { Message } from "node-nats-streaming";
import { subjects,Listener,PaymentCompletedEvent, OrderStatus } from "@myticketingdev/common";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";
export class PaymentCompletedListener extends Listener<PaymentCompletedEvent>{
	readonly subject= subjects.paymentCompleted;
	queueGroupName=queueGroupName;

	async onMessage(data: PaymentCompletedEvent['data'], msg: Message) {
		console.log("PaymentCompleted Event recevied data:",data," msg: ",msg);
		const {id,orderId,stripeId} = data
		const order = await Order.findById(orderId)
		if(!order){
			console.error("order not found")
			throw new Error('order not found')
		}
		order.set({status:OrderStatus.Completed})
		await order.save()
		console.log("order completed",order);
	
		msg.ack()
	}
}