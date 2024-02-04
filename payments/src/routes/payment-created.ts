import express ,{Request, Response} from "express";
import { ExpressValidator, body } from "express-validator";
import { requireAuthHandler, validationHandler,BadRequestError,NotFoundError, UnauthorizedError, OrderStatus } from '@myticketingdev/common';
import { Order } from "../models/order";
import { stripe } from "../stripe";
import { Payment } from "../models/payment";
import { PaymentCompletedPublisher } from "../events/publishers/payment-completed-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router()
router.post('/api/payments',requireAuthHandler,[
	body('token')
  .not()
  .isEmpty(),
	body('orderId')
  .not()
  .isEmpty()
],validationHandler,async (req:Request,res:Response)=>{
	const {token,orderId}=req.body
	const order = await Order.findById(orderId)
	if(!order){
		throw new NotFoundError()
	}
	if(order.userId !== req.currentUser!.id){
		throw new UnauthorizedError()
	}
	if(order.status === OrderStatus.Cancelled){
		throw new BadRequestError("cann't pay for cancelled order")
	}
	const chargeResponse =await stripe.charges.create({
		currency: 'usd',
		amount: order.price * 100,
		source: token,
	});
	const payment=Payment.build(
		{
			orderId:orderId,
			stripeId:chargeResponse.id
		})
	await	payment.save()

  new PaymentCompletedPublisher(natsWrapper.client).publish({
		id:payment.id,
		orderId:payment.orderId,
		stripeId:payment.stripeId
	})
	res.status(201).send({paymentid:payment.id})

})
export {router as createChargeRouter}