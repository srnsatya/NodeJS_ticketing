import { Message } from "node-nats-streaming";
import { Publisher } from "@myticketingdev/common";
import { TicketCreatedEvent } from "@myticketingdev/common";
import { subjects } from "@myticketingdev/common";
export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
	readonly subject = subjects.ticketCreated

}
 