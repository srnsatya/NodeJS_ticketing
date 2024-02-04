import express, { Request, Response } from 'express';
import { OrderStatus, UnauthorizedError, requireAuthHandler, validationHandler } from '@myticketingdev/common';
import { body} from 'express-validator';
import { Order } from '../models/order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper'; 
import { NotFoundError } from '@myticketingdev/common';
const router = express.Router();

router.delete('/api/orders/:orderId',requireAuthHandler, async(req: Request, res: Response) => {
	const orders = await Order.findById(req.params.orderId).populate('ticket')
	if(!orders){
			throw new NotFoundError()
	}	else if(req.currentUser!.id != orders.userId){
		throw new UnauthorizedError()
	}
	orders.status = OrderStatus.Cancelled
	await orders.save()
	 //publish order
	 new OrderCancelledPublisher(natsWrapper.client).publish({
		id:orders.id,
		version:orders.version,
		userId: orders.userId,
		ticket:{
			id:orders.ticket.id
		}
	})
	res.status(204).send(orders)
});

export { router as deleteOrdersRouter };
