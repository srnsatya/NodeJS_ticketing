
import mongoose from 'mongoose'
import { app } from './app';
import { BadRequestError } from '@myticketingdev/common'
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { ExpirationCompletedListener } from './events/listeners/expiration-completed-listener';
import { PaymentCompletedListener } from './events/listeners/payment-completed-listener';
const start =async () => {
	console.log('starting order service...')
	
	// during start up it will check the secrete is created or not
	if(!process.env.JWT_KEY){
		throw new BadRequestError('JWT_KEY not found!!')
	}else{
		console.log('process.env.JWT_KEY:',process.env.JWT_KEY)
	}
	if(!process.env.MONGO_URI){
		throw new BadRequestError('MONGO_URI not found!!')
	}else{
		console.log('process.env.MONGO_URI:',process.env.MONGO_URI)
	}
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
		new TicketCreatedListener(natsWrapper.client).listen()
		new TicketUpdatedListener(natsWrapper.client).listen()
		new ExpirationCompletedListener(natsWrapper.client).listen()
		new PaymentCompletedListener(natsWrapper.client).listen()
		
		
	}catch(err){
		console.error('nat connection failed',err)
	}
	console.log('nat end connection')
	console.log('start connection')
	try{
		 await mongoose.connect(process.env.MONGO_URI)
		 .then(() => console.log('Connected to tickets mongo db!'));
	//	await mongoose.connect('mongodb://0.0.0.0:27017/auth').then(() => console.log('Connected to local mongo db!'));
	}catch(err){
		console.error(err)
	}
	console.log('end connection')
	app.listen(5000, ()=>{
		console.log('listening port 5000!!!!!!!##!!!!!!!!!')
	})

}
start();
