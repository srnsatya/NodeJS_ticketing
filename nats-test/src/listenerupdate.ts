import nats,{Message, Stan} from 'node-nats-streaming'
import { TicketUpdatedListener } from './events/ticket-updated-listener'
import { randomBytes } from 'crypto'
//nats.connect('clusterId','clientid','list of parameters url,timeout etc')
const stan = nats.connect(
	'ticketing','srnsatyaListener'+randomBytes(4).toString('hex'),{
		url:'http://localhost:4222'
	}
)

stan.on('connect',()=>{
	console.log('listener is connected ')

	stan.on('close',()=>{
		console.log('NAT connection closed!!')
		process.exit()
	})
	
	new TicketUpdatedListener(stan).listen()
	 
})
process.on('SIGINT',()=>stan.close())
process.on('SIGTERM',()=>stan.close())
