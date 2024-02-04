import nats from 'node-nats-streaming'
import { TicketCreatedPublisher } from './events/ticket-created-publisher'
//nats.connect('clusterId','clientid','list of parameters-url,timeout etc')
const stan = nats.connect(
	'ticketing','srnsatyaPublisher',{
		url:'http://localhost:4222'
	}
)
stan.on ('connect',async ()=>{
	console.log('Publisher is connected ')
	const publisher = new TicketCreatedPublisher(stan)
	try{
		await publisher.publish({
			id:'1000',
			title:'Jatra ticket updated',
			price:420,
			userId:'sn2449'
		})
	}catch(err){
		console.log('err ',err)
	}
	

})