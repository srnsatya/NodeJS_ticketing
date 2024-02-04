import { subjects,PaymentCompletedEvent,Publisher } from "@myticketingdev/common";


export class PaymentCompletedPublisher extends Publisher<PaymentCompletedEvent>{
	readonly subject = subjects.paymentCompleted

}