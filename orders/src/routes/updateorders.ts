import express, { Request, Response } from 'express';
import { UnauthorizedError, requireAuthHandler, validationHandler } from '@myticketingdev/common';
import { body} from 'express-validator';
import { Order } from '../models/order';
import { NotFoundError } from '@myticketingdev/common';
//import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';
const router = express.Router();

router.put('/api/orders/:orderId',requireAuthHandler,[
	],validationHandler,  async(req: Request, res: Response) => {
	const orderinfo = await Order.findById(req.params.orderId)
	if(!orderinfo){
			throw new NotFoundError()
	}else if(req.currentUser!.id != orderinfo.userId){
    throw new UnauthorizedError()
  }else{
   // ticket.title=req.body.title?req.body.title:ticket.title
   // ticket.price=req.body.price?req.body.price:ticket.price
   orderinfo.set({
      status: req.body.status,
      ticketId: req.body.ticketId,
      expiredAt: req.body.expiredAt,
    }) 
   await orderinfo.save()
  //  new TicketUpdatedPublisher(natsWrapper.client).publish({
  //   id:ticket.id,
  //   title: ticket.title,
  //   price: ticket.price,
  //   userId: ticket.userId

  // })
  }
	res.status(200).send(orderinfo)
});

export { router as updateTicketRouter };
