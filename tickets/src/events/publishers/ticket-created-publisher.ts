import { Publisher,TicketCreatedEvent,subjects } from "@myticketingdev/common";
export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
	readonly subject = subjects.ticketCreated

}
 