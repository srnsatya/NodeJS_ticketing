import { Message } from "node-nats-streaming";
import { subjects,Listener,OrderCreatedEvent, NotFoundError } from "@myticketingdev/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
	readonly subject= subjects.orderCreated;
	queueGroupName=queueGroupName;

	async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
		console.log("Event recevied data:",data," msg: ",msg);
		const {id,price} = data.ticket
		const ticket = await Ticket.findById(id)
		if(!ticket){
			console.error("ticket not found")
			throw new Error('ticket not found')
		}
		ticket.set({ orderId: data.id });
		//ticket.stat
		await ticket.save()
		await new TicketUpdatedPublisher(this.client).publish({
      id:ticket.id,
      version:ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
			orderId: data.id 
    })
		console.log("ticket updated",ticket);
	
		msg.ack()
	}
}