import request from 'supertest';
import { app } from '../../app';
import { Ticket, TicketDoc } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';
const buildTicket = async (title: string, price: number) =>{
	const ticket =Ticket.build({
		id:new mongoose.Types.ObjectId().toHexString(),
		title,
		price
	})
	await ticket.save()
	return ticket
}
const buildOrder = async (status: OrderStatus,expiresAt: Date, ticket: TicketDoc, userId: string) =>{
	const order =Order.build({
		status: OrderStatus.Created,
		ticket,
		expiresAt,
		userId
	})
	await order.save()
	return order
}

it('return Auth error if user not signed in',async()=>{
	const response = await request(app)
	.get('/api/orders')
	.send({
	});
	console.log('retrieveAllOrders unAuth statuscode:',response.statusCode);
	console.log('retrieveAllOrders unAuth body:',response.body)
	expect(response.status).toEqual(401);
})

it('return all Orders if user  signed in',async()=>{
	//user 1 tickets 
	const ticket1=await buildTicket('Jatra-1',100)
	const ticket2=await buildTicket('Jatra-2',200)
	const ticket3=await buildTicket('Jatra-3',300)
	
	const order1Response = await request(app)
	.post('/api/orders')
	.set('Cookie',global.globalSignupCookie())
	.send({
		ticketId:ticket1.id
	});

	expect(order1Response.status).toEqual(201)

	const order2Response = await request(app)
	.post('/api/orders')
	.set('Cookie',global.globalSignupCookieP('pqrst','pqrst@pqrst.com'))
	.send({
		ticketId:ticket2.id
	});

	expect(order2Response.status).toEqual(201)

	const order3Response = await request(app)
	.post('/api/orders')
	.set('Cookie',global.globalSignupCookie())
	.send({
		ticketId:ticket3.id
	});

	expect(order3Response.status).toEqual(201)

	const getresponseUser2 = await request(app)
	.get('/api/orders')
	.set('Cookie',global.globalSignupCookieP('pqrst','pqrst@pqrst.com'))
	.send({
	});
	console.log('retrieveAllOrders getresponseUser2 validUser statuscode:',getresponseUser2.statusCode);
	console.log('retrieveAllOrders getresponseUser2 validUser body:',getresponseUser2.body)
	expect(getresponseUser2.status).not.toEqual(401)
	expect(getresponseUser2.status).toEqual(200)
	expect(getresponseUser2.body.length).toEqual(1)
	const getresponseUser1 = await request(app)
	.get('/api/orders')
	.set('Cookie',global.globalSignupCookie())
	.send({
	});
	console.log('retrieveAllOrders getresponseUser1 validUser statuscode:',getresponseUser1.statusCode);
	console.log('retrieveAllOrders getresponseUser1 validUser body:',getresponseUser1.body)
	expect(getresponseUser1.status).not.toEqual(401)
	expect(getresponseUser1.status).toEqual(200)
	expect(getresponseUser1.body.length).toEqual(2)
	expect(getresponseUser1.body[0].id).toEqual(order1Response.body.id)
	expect(getresponseUser1.body[1].id).toEqual(order3Response.body.id)
})
