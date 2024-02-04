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

it('return 401 Auth error if user not signed in',async()=>{
  const id = new mongoose.Types.ObjectId().toHexString();
	const response = await request(app)
	.get(`/api/orders/${id}`)
	.send({
	});
	console.log('showOrder unAuth statuscode:',response.statusCode);
	console.log('showOrder unAuth body:',response.body)
	expect(response.status).toEqual(401);
})

it('returns a 401 if the order is not from same user', async () => {
	const ticket1=await buildTicket('Jatra-1',100)
	const order1Response = await request(app)
	.post('/api/orders')
	.set('Cookie',global.globalSignupCookie())
	.send({
		ticketId:ticket1.id
	});

	expect(order1Response.status).toEqual(201)
	const id = new mongoose.Types.ObjectId().toHexString();
  console.log("generated id:",id)
  const response = await request(app)
	.get(`/api/orders/${order1Response.body.id}`)
	.set('Cookie',global.globalSignupCookieP('pqrst','pqrst@pqrst.com'))
	.send().expect(401);
	console.log('showOrder different User statuscode:',response.statusCode);
	console.log('showOrder different User body:',response.body)
});

it('returns a 404 if the order is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  console.log("generated id:",id)
  const response = await request(app)
	.get(`/api/orders/${id}`)
	.set('Cookie',global.globalSignupCookie())
	.send().expect(404);
	console.log('showOrder not found statuscode:',response.statusCode);
	console.log('showOrder not found body:',response.body)
});

it('returns a order if the order is found for same user', async () => {	
const ticket1=await buildTicket('Current Movies',100)
	const {body: order1resBody,status: responsestatus} = await request(app)
	.post('/api/orders')
	.set('Cookie',global.globalSignupCookie())
	.send({
		ticketId:ticket1.id
	});
console.log('show user order1Response:',order1resBody)
expect(responsestatus).toEqual(201)
const id = new mongoose.Types.ObjectId().toHexString();
console.log("generated id:",id)
const response = await request(app)
.get(`/api/orders/${order1resBody.id}`)
.set('Cookie',global.globalSignupCookie())
.send().expect(200);
console.log('showOrder current User statuscode:',response.statusCode);
console.log('showOrder current User body:',response.body)

});