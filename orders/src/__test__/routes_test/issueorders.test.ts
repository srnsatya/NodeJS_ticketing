import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';


it('return error if ticket not exist',async()=>{
  const id = new mongoose.Types.ObjectId().toHexString();
	const response = await request(app)
	.post('/api/orders')
	.set('Cookie',global.globalSignupCookie())
	.send({
		ticketId:id
	});
	console.log('issueorder statuscode:',response.statusCode);
	console.log('issueorder body:',response.body)
	expect(response.status).not.toEqual(404)
	expect(response.status).toEqual(400);
})

it('return error if ticket is reserved',async()=>{
	const ticket =Ticket.build({
		id:new mongoose.Types.ObjectId().toHexString(),
		title:'Jatra-1',
		price:100
	})
	await ticket.save()
	const order = Order.build({
		status: OrderStatus.Created,
		ticket,
		expiresAt: new Date(),
		userId:'abc'
	})
	await order.save()
	const response = await request(app)
	.post('/api/orders')
	.set('Cookie',global.globalSignupCookie())
	.send({
		ticketId:ticket.id
	});
	console.log('reservedorder statuscode:',response.statusCode);
	console.log('reservedorder body:',response.body)
	expect(response.status).not.toEqual(404)
	expect(response.status).toEqual(400)
})

it('reserve  if ticket is not reserved',async()=>{
	const ticket =Ticket.build({
		id:new mongoose.Types.ObjectId().toHexString(),
		title:'Jatra-2',
		price:100
	})
	await ticket.save()
	const response = await request(app)
	.post('/api/orders')
	.set('Cookie',global.globalSignupCookie())
	.send({
		ticketId:ticket.id
	});
	console.log('new order new ticket statuscode:',response.statusCode);
	console.log('new order new ticket  body:',response.body)
	expect(response.status).not.toEqual(404)
	expect(response.status).toEqual(201)
	
})


it('reserves  Check event created or not',async()=>{
	const ticket =Ticket.build({
		id:new mongoose.Types.ObjectId().toHexString(),
		title:'Jatra-2',
		price:100
	})
	await ticket.save()
	const response = await request(app)
	.post('/api/orders')
	.set('Cookie',global.globalSignupCookie())
	.send({
		ticketId:ticket.id
	});
	console.log('new order new ticket statuscode:',response.statusCode);
	console.log('new order new ticket  body:',response.body)
	expect(response.status).not.toEqual(404)
	expect(response.status).toEqual(201)

	expect(natsWrapper.client.publish).toHaveBeenCalled()
	
})