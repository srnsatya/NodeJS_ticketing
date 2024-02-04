import  Queue  from "bull";
import { natsWrapper } from "../nats-wrapper";
import { ExpirationCompletedPublisher } from "../events/publishers/expiration-completed-publisher";

interface RedisPayload{
orderId: string
}
const expirationQueue  = new Queue<RedisPayload>('order:expiration',{
	redis:{
		host:process.env.REDIS_HOST
	}

})
expirationQueue.process(async( job)=>{
	console.log('I want to publish expiration:completed for orderid:',job.data.orderId);
	new ExpirationCompletedPublisher(natsWrapper.client).publish({
		orderId:job.data.orderId,
	})
})

export {expirationQueue}