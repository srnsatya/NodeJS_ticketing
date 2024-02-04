import request from 'supertest';
import { app } from '../../app';
import { ExpirationCompletedListener } from '../../events/listeners/expiration-completed-listener';
import { natsWrapper } from '../../nats-wrapper';
import { OrderStatus, ExpirationCompletedEvent } from '@myticketingdev/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { Order } from '../../models/order';
const setup =async () => {
	// create a instance of listener
	const listener = new ExpirationCompletedListener(natsWrapper.client)
	// create a fake object before update
	const ticket = Ticket.build({
		id:new mongoose.Types.ObjectId().toHexString(),
		title:'Movies',
		price:100
	})
	await ticket.save()
	// create fake data update
	const order = Order.build({
		status: OrderStatus.Created,
		ticket,
		expiresAt: new Date(),
		userId:'abc'
	})
	await order.save()

	const data:ExpirationCompletedEvent['data']={
		orderId:order.id
	}

	//@ts-ignore
	const msg: Message ={
		ack:jest.fn()
	}

	return {listener,ticket,order,data,msg}
}
it('listener updates the order status to cancelled',async()=>{

const {listener,ticket,order,data,msg}= await setup()
	
	await listener.onMessage(data,msg)
	const updatedOrder = await Order.findById(order.id)
	expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled)
})

it('emit order cancell event by order cancelled publisher',async()=>{

	const {listener,ticket,order,data,msg}= await setup()
	await listener.onMessage(data,msg)
	expect(natsWrapper.client.publish).toHaveBeenCalled()

	const eventData=JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
	console.log('eventData:',eventData)
	expect(eventData.id).toEqual(order.id)
})

	it('ack is executed at the end',async()=>{

		const {listener,ticket,order,data,msg}= await setup()
	  await listener.onMessage(data,msg)
		expect(msg.ack).toHaveBeenCalled()
			
})
	
