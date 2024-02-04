import { Message } from "node-nats-streaming";
import { subjects,Listener,TicketCreatedEvent } from "@myticketingdev/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
	readonly subject= subjects.ticketCreated;
	queueGroupName=queueGroupName;

	async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
		console.log("Event recevied data:",data," msg: ",msg);
		const {id,title,price} = data
		const ticket = Ticket.build({
			id,title,price
		})
		await ticket.save()
		console.log("ticket created",ticket.id);
	
		msg.ack()
	}
}