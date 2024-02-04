import express, { Request, Response } from 'express';
import { UnauthorizedError, requireAuthHandler, validationHandler } from '@myticketingdev/common';
import { body} from 'express-validator';
import { Order } from '../models/order';
import { NotFoundError } from '@myticketingdev/common';
const router = express.Router();

router.get('/api/orders/:orderId',requireAuthHandler, async(req: Request, res: Response) => {
	const orderdetails = await Order.findById(req.params.orderId).populate('ticket')
	if(!orderdetails){
			throw new NotFoundError()
	}
	else if(req.currentUser!.id != orderdetails.userId){
	throw new UnauthorizedError()
}
	res.send(orderdetails)
});

export { router as findOrderRouter };
