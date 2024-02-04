

import { BadRequestError } from '@myticketingdev/common'
import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
const start =async () => {

	
	// during start up it will check the secrete is created or not

	if(!process.env.NAT_URI){
		throw new BadRequestError('NAT_URI not found!!')
	}else{
		console.log('process.env.NAT_URI:',process.env.NAT_URI)
	}
	if(!process.env.NAT_CLUSTERID){
		throw new BadRequestError('NAT_CLUSTERID not found!!')
	}else{
		console.log('process.env.NAT_CLUSTERID:',process.env.NAT_CLUSTERID)
	}
	if(!process.env.NAT_CLIENTID){
		throw new BadRequestError('NAT_CLIENTID not found!!')
	}else{
		console.log('process.env.NAT_CLIENTID:',process.env.NAT_CLIENTID)
	}
	console.log('nat connection')
	try{
		
		/* await natsWrapper.connect('ticketing','srnsatyaPublisher111',
			'http://nats-srv:4222'
		)*/
		await natsWrapper.connect(process.env.NAT_CLUSTERID,process.env.NAT_CLIENTID,
			process.env.NAT_URI
		 )
		natsWrapper.client.on('close',()=>{
			console.log('NAT connection closed!!')
			process.exit()
		})
		process.on('SIGINT',()=>natsWrapper.client.close())
		process.on('SIGTERM',()=>natsWrapper.client.close())
		new OrderCreatedListener(natsWrapper.client).listen()
	}catch(err){
		console.error('nat connection failed',err)
	}
	console.log('nat end connection')

}
start();
