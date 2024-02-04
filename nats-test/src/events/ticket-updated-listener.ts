import { Message } from "node-nats-streaming";
import { Listener } from "@myticketingdev/common";
import { TicketUpdatedEvent } from "@myticketingdev/common";
import { subjects } from  "@myticketingdev/common";
export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
	readonly subject = subjects.ticketUpdated
	queueGroupName= 'payments-service'

	onMessage(data: TicketUpdatedEvent['data'], msg: Message){
	 console.log('event data:',data)
	 console.log('data.id',data.id,'data.price',data.price,'data.title',data.title)
	 msg.ack()
	}

}
 