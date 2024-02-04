import { Publisher,ExpirationCompletedEvent,subjects } from "@myticketingdev/common";

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent>{

	readonly subject = subjects.expirationCompleted
}