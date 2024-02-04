import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { OrderStatus } from "@myticketingdev/common";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";
//jest.mock('../../stripe')
/*
it('return 401 when user not logged in',async()=>{

	const response = await request(app)
	.post('/api/payments')
	//.set('Cookie',globalSignupCookie())
	.send({
		token:'asasasss',
		orderId: new mongoose.Types.ObjectId().toHexString()
	});
console.log(' return 401 when user not logged in',response.status)
expect(response.status).toEqual(401);

})
it('return 404 when order not found',async()=>{
	const response = await request(app)
			.post('/api/payments')
			.set('Cookie',globalSignupCookie())
			.send({
				token:'asasasss',
				orderId: new mongoose.Types.ObjectId().toHexString()
			});
  console.log(' return 404 when order not found',response.status)
  expect(response.status).toEqual(404);
})


it('return 401 when user not owning order',async()=>{
	const tempOrder=	Order.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		userId: new mongoose.Types.ObjectId().toHexString(),
		version: 0,
		price: 3000,
		status: OrderStatus.Created
	})
	await tempOrder.save();
	const response = await request(app)
	.post('/api/payments')
	.set('Cookie',globalSignupCookie()) // other user
	.send({
		token:'asasasss',
		orderId: tempOrder.id
	});
console.log('return 401 when user not owning order',response.status)
expect(response.status).toEqual(401);

})
it('return 400 when user tries to payment on cancelled order',async()=>{

	const tempOrder=	Order.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		userId: 'abc',
		version: 0,
		price: 3000,
		status: OrderStatus.Cancelled
	})
	await tempOrder.save();
	const response = await request(app)
	.post('/api/payments')
	.set('Cookie',globalSignupCookieP('abc','abc@abc.com')) // other user
	.send({
		token:'asasasss',
		orderId: tempOrder.id
	});
console.log('return 400 when user tries to payment on cancelled order',response.status,response.body)
expect(response.status).toEqual(400);
})
*/
it('return 201 if user is same for payment',async()=>{
	const price =Math.floor(Math.random()*10000)
	const tempOrder=	Order.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		userId: 'abc',
		version: 0,
		price: price,
		status: OrderStatus.Created
	})
	await tempOrder.save();
	const response = await request(app)
	.post('/api/payments')
	.set('Cookie',globalSignupCookieP('abc','abc@abc.com')) // other user
	.send({
		token:'tok_visa',
		orderId: tempOrder.id
	});
console.log('return 201 if user is same for payment',response.status,response.body)
expect(response.status).toEqual(201);

/* with stripe mocking
const chargesOPtions = (stripe.charges.create as jest.Mock).mock.calls[0][0]
console.log(chargesOPtions)
expect(chargesOPtions.source).toEqual('tok_visa');
expect(chargesOPtions.amount).toEqual(3000*100);
expect(chargesOPtions.currency).toEqual('usd');*/

/* below by calling rea; stripe */
const stripeCharges =  await stripe.charges.list({limit:50})


const stripeCharge = stripeCharges.data.find(charge =>{
		return charge.amount ===price * 100
})
console.log('price:',price,' stripeCharge:',stripeCharge);
expect(stripeCharge).toBeDefined()
expect(stripeCharge!.currency).toEqual('usd')
const payment = await Payment.findOne({
	orderId: tempOrder.id,
	stripeId: stripeCharge!.id
})
expect(payment).not.toBeNull()
})