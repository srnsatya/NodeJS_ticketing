import { Message } from "node-nats-streaming";
import { subjects,Listener,OrderCancelledEvent, NotFoundError } from "@myticketingdev/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
	readonly subject= subjects.orderCancelled;
	queueGroupName=queueGroupName;

	async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
		console.log("Event recevied data:",data," msg: ",msg);
		const {id} = data.ticket
		const ticket = await Ticket.findById(id)
		if(!ticket){
			console.error("ticket not found")
			throw new Error('ticket not found')
		}
		ticket.set({ orderId: undefined});
		//ticket.set({title,price})
		await ticket.save()
		await new TicketUpdatedPublisher(this.client).publish({
      id:ticket.id,
      version:ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
			orderId: ticket.orderId 
    })
		console.log("ticket updated",ticket);
	
		msg.ack()
	}
}