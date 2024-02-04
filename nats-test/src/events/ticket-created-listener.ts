import { Message } from "node-nats-streaming";
import { Listener } from "@myticketingdev/common";
import { TicketCreatedEvent } from "@myticketingdev/common";
import { subjects } from  "@myticketingdev/common";
export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
	readonly subject = subjects.ticketCreated
	queueGroupName= 'payments-service'

	onMessage(data: TicketCreatedEvent['data'], msg: Message){
	 console.log('event data:',data)
	 console.log('data.id',data.id,'data.price',data.price,'data.title',data.title)
	 msg.ack()
	}

}
 