import { Message } from "node-nats-streaming";
import { subjects,Listener,TicketUpdatedEvent } from "@myticketingdev/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
	readonly subject= subjects.ticketUpdated;
	queueGroupName=queueGroupName;

	async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
		console.log("Event recevied data:",data," msg: ",msg);
		const {id,title,price,version} = data
		const ticket = await Ticket.findByIdandPrevVersion({id,
version
		})
		if(!ticket){
			console.error("ticket not found")
			throw new Error('ticket not found')
		}
		ticket.set({title,price})
		await ticket.save()
		console.log("ticket updated",ticket);
	
		msg.ack()
	}
}