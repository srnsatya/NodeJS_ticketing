import { Ticket } from "../../models/ticket";

it('implement concurrency control',async ()=>{

	const ticket = Ticket.build({
		title: 'theatre',
		price:5,
		userId:'1bc'
	})
	await ticket.save();

	const firstticketObj =await Ticket.findById(ticket.id)
	const secondticketObj =await Ticket.findById(ticket.id)

	firstticketObj?.set({
		title: 'theatre1',
		price:'200'
	})

	 secondticketObj?.set({
	 	title: 'theatre15',
	 	price:'300'
	 })
	await firstticketObj!.save();
	try{
		await secondticketObj!.save();
	}catch (err) {
		console.error(err)
    return;
  }
	throw new Error('Should not reach this point')
	

})


it('implement version is increasing or not',async ()=>{

	const ticket = Ticket.build({
		title: 'theatre',
		price:5,
		userId:'1bc'
	})
	await ticket.save();

	const firstticketObj =await Ticket.findById(ticket.id)
	console.log('firstticketObj version',firstticketObj!.version)
  expect(firstticketObj!.version).toEqual(0);
	firstticketObj?.set({
		title: 'theatre1',
		price:'200'
	})

	await firstticketObj!.save();
	const secondticketObj =await Ticket.findById(ticket.id)
	console.log('secondticketObj version',secondticketObj!.version)
	expect(secondticketObj!.version).toEqual(1);

})