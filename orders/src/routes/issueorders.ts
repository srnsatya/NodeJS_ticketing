import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { BadRequestError, NotFoundError, OrderStatus, requireAuthHandler, validationHandler } from '@myticketingdev/common';
import { body} from 'express-validator';
import { Order } from '../models/order';
import { Ticket } from '../models/ticket';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';
const router = express.Router();
const EXPIRATION_WINDOW_SECONDS = 1*60
router.post('/api/orders',requireAuthHandler,[
	body('ticketId')
  .not()
  .isEmpty()
  .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
  .withMessage('valid ticketId must be provided ')
],validationHandler, async(req: Request, res: Response) => {
	const {ticketId} = req.body
  const ticket = await Ticket.findById(ticketId)
  console.log('ticket:',ticket);
  
  if(!ticket){
   // throw new NotFoundError()
    throw new BadRequestError('Ticket is not Found !!')

  }
  console.log('here:');
  const isReserved = await ticket.isReserved()
  if(isReserved){
    throw new BadRequestError('Ticket is already reserved !!')
  }
  const expiration = new Date()
  expiration.setSeconds(expiration.getSeconds()+EXPIRATION_WINDOW_SECONDS)
     const order = Order.build({
      status: OrderStatus.Created,
      ticket:ticket,
      expiresAt:expiration,
      userId: req.currentUser!.id,
    });
    await order.save();
  //publish order
  new OrderCreatedPublisher(natsWrapper.client).publish({
      id:order.id,
      version:order.version,
      status: order.status,
      expiresAt:order.expiresAt.toISOString(),
      userId: order.userId,
      ticket:{
        price:ticket.price,
        id:ticket.id
      }
    })
    res.status(201).send(order);

});

export { router as createTicketRouter };
