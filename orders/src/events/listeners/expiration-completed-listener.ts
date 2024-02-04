import { Message } from "node-nats-streaming";
import { subjects,Listener,ExpirationCompletedEvent, NotFoundError, OrderStatus } from "@myticketingdev/common";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { natsWrapper } from "../../nats-wrapper";
export class ExpirationCompletedListener extends Listener<ExpirationCompletedEvent>{
	readonly subject= subjects.expirationCompleted;
	queueGroupName=queueGroupName;

	async onMessage(data: ExpirationCompletedEvent['data'], msg: Message) {
		console.log("ExpirationCompletedEvent recevied data:",data," msg: ",msg);
		const {orderId} = data

		console.log("Order expired with orderId:",orderId);
		const orders = await Order.findById(orderId).populate('ticket')
	if(!orders){
			throw new NotFoundError()
	}	
	if(orders.status === OrderStatus.Completed){
		return msg.ack()
	}
	orders.status = OrderStatus.Cancelled
	await orders.save()
	 //publish order
	 new OrderCancelledPublisher(natsWrapper.client).publish({
		id:orders.id,
		version:orders.version,
		userId: orders.userId,
		ticket:{
			id:orders.ticket.id
		}
	})
		msg.ack()
	}
}