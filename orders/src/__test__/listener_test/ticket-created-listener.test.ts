import request from 'supertest';
import { app } from '../../app';
import { TicketCreatedListener } from '../../events/listeners/ticket-created-listener';
import { natsWrapper } from '../../nats-wrapper';
import { TicketCreatedEvent } from '@myticketingdev/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
const setup =async () => {
	// create a instance of listener
	const listener = new TicketCreatedListener(natsWrapper.client)
	// create a event
	const data: TicketCreatedEvent['data'] ={
		id:new mongoose.Types.ObjectId().toHexString(),
		version:0,
		title:'Movies',
		price:100,
		userId:new mongoose.Types.ObjectId().toHexString()
	}
	// call onMessage function
	//@ts-ignore
	const msg: Message ={
		ack:jest.fn()
	}

	return {listener,data,msg}
}
it('create and saves a ticket',async()=>{

const {listener,data,msg}= await setup()
	
	// call onMessage function
	await listener.onMessage(data,msg)
	//write assertion to check ticket created 
	const ticket = await Ticket.findById(data.id)

	expect(ticket).toBeDefined()
	expect(ticket!.title).toEqual(data.title)
	expect(ticket!.price).toEqual(data.price)
})

it('check if ack is called or not',async()=>{

	const {listener,data,msg}= await setup()
		
		// call onMessage function
		await listener.onMessage(data,msg)
		//write assertion to check ticket created 
		const ticket = await Ticket.findById(data.id)
	
		expect(ticket).toBeDefined()
		expect(ticket!.title).toEqual(data.title)
		expect(ticket!.price).toEqual(data.price)

		//check if ack is called or not
		expect(msg.ack).toHaveBeenCalled()
})