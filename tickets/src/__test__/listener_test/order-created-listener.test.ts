import request from 'supertest';
import { app } from '../../app';
import { OrderCreatedListener } from '../../events/listeners/order-created-listener';
import { natsWrapper } from '../../nats-wrapper';
import { OrderCreatedEvent,OrderStatus } from '@myticketingdev/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
const setup =async () => {
	// create a instance of listener
	const listener = new OrderCreatedListener(natsWrapper.client)
	// create a ticket

	const ticket = Ticket.build({
		title: 'theatre',
		price:5,
		userId:'1bc'
	})
	await ticket.save();
	
	
	// create a event
	const data: OrderCreatedEvent['data'] ={
		id:new mongoose.Types.ObjectId().toHexString(),
		version:0,
    status: OrderStatus.Created,
    userId: '1bc',
    expiresAt: 'asas',
    ticket: {
        id: ticket.id,
        price: ticket.price
    }
	}
	// call onMessage function
	//@ts-ignore
	const msg: Message ={
		ack:jest.fn()
	}

	return {listener,data,msg}
}

it('set the userid is done properly',async()=>{

	const {listener,data,msg}= await setup()
		
		// call onMessage function
		await listener.onMessage(data,msg)
		//write assertion to check ticket created 
		const ticket = await Ticket.findById(data.ticket.id)
	
		expect(ticket).toBeDefined()
		expect(ticket!.orderId).toEqual(data.id)
	})
	
	it('set the userid is done properly and ack send',async()=>{

		const {listener,data,msg}= await setup()
		
		// call onMessage function
		await listener.onMessage(data,msg)
		//write assertion to check ticket created 
		const ticket = await Ticket.findById(data.ticket.id)
	
		expect(ticket).toBeDefined()
		expect(ticket!.orderId).toEqual(data.id)
		
		//check if ack is called or not
		expect(msg.ack).toHaveBeenCalled()
	})

	it('set the userid is done properly and ack send',async()=>{

		const {listener,data,msg}= await setup()
		// call onMessage function
		await listener.onMessage(data,msg)
		//write assertion to check ticket created 
		const ticket = await Ticket.findById(data.ticket.id)
	
		expect(ticket).toBeDefined()
		expect(ticket!.orderId).toEqual(data.id)
		
		//check if ack is called or not
		expect(msg.ack).toHaveBeenCalled()

		expect(natsWrapper.client.publish).toHaveBeenCalled()
		
		
		console.log(JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]));
		
	})