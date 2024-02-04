import request from 'supertest';
import { app } from '../../app';
import { TicketUpdatedListener } from '../../events/listeners/ticket-updated-listener';
import { natsWrapper } from '../../nats-wrapper';
import { TicketUpdatedEvent } from '@myticketingdev/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
const setup =async () => {
	// create a instance of listener
	const listener = new TicketUpdatedListener(natsWrapper.client)
	// create a fake object before update
	const ticket = Ticket.build({
		id:new mongoose.Types.ObjectId().toHexString(),
		title:'Movies',
		price:100
	})
	await ticket.save()
	// create fake data update

	const data: TicketUpdatedEvent['data'] ={
		id:ticket.id,
		version:ticket.version+1,
		title:'Movies-2',
		price:200,
		userId:'asas'
	}
	//@ts-ignore
	const msg: Message ={
		ack:jest.fn()
	}

	return {listener,data,msg,ticket}
}
it('find updates and saves the ticket',async()=>{

const {listener,data,msg,ticket}= await setup()
	
	// call onMessage function
	await listener.onMessage(data,msg)
	//write assertion to check ticket created 
	const updatedTicket = await Ticket.findById(data.id)

	expect(updatedTicket).toBeDefined()
	expect(updatedTicket!.title).toEqual(data.title)
	expect(updatedTicket!.price).toEqual(data.price)
	expect(updatedTicket!.version).toEqual(data.version)
})

it('find updates and saves the ticket check if ack is called or not',async()=>{

	const {listener,data,msg,ticket}= await setup()
	
	// call onMessage function
	await listener.onMessage(data,msg)
	//write assertion to check ticket created 
	const updatedTicket = await Ticket.findById(data.id)

	expect(updatedTicket).toBeDefined()
	expect(updatedTicket!.title).toEqual(data.title)
	expect(updatedTicket!.price).toEqual(data.price)
	expect(updatedTicket!.version).toEqual(data.version)
		//check if ack is called or not
		expect(msg.ack).toHaveBeenCalled()
})


it('find updates and fails if version mismatch',async()=>{

	const {listener,data,msg,ticket}= await setup()
	data.version=data.version+2
	// call onMessage function
	try{
		await listener.onMessage(data,msg)
	}
	catch(err){
		console.log("err:",err);
		
	}

	//write assertion to check ticket created 
	
		expect(msg.ack).not.toHaveBeenCalled()
})