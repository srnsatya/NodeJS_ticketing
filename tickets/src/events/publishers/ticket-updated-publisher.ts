import { Publisher,TicketUpdatedEvent,subjects } from "@myticketingdev/common";
export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
	readonly subject = subjects.ticketUpdated

}
 