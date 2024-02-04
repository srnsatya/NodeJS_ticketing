import express, { Request, Response } from 'express';
import { requireAuthHandler, validationHandler } from '@myticketingdev/common';
import { body} from 'express-validator';
import { Order } from '../models/order';
import { NotFoundError } from '@myticketingdev/common';
const router = express.Router();

router.get('/api/orders',requireAuthHandler ,async(req: Request, res: Response) => {
	const orders = await Order.find({
		userId:req.currentUser!.id
	}).populate('ticket')
	if(!orders){
			throw new NotFoundError()
	}
	res.send(orders)
});

export { router as retrieveAllOrders };
