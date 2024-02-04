import express, { Request, Response } from 'express';
import { BadRequestError, UnauthorizedError, requireAuthHandler, validationHandler } from '@myticketingdev/common';
import { body} from 'express-validator';
import { Ticket } from '../models/ticket';
import { NotFoundError } from '@myticketingdev/common';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';
const router = express.Router();

router.put('/api/tickets/:id',requireAuthHandler,[
	body('price').isFloat({gt:0}).withMessage('price must be  greater than 0'),
	body('title').trim().isLength({min:4,max:20}).withMessage('title must be 4 to 20 characters')
],validationHandler,  async(req: Request, res: Response) => {
	const ticket = await Ticket.findById(req.params.id)
	if(!ticket){
			throw new NotFoundError()
	}else {
    if(req.currentUser!.id != ticket.userId){
      throw new UnauthorizedError()
    }
    if(ticket.orderId){
      throw new BadRequestError("Edit is not allowed for reserved Ticket ")
    }
   // ticket.title=req.body.title?req.body.title:ticket.title
   // ticket.price=req.body.price?req.body.price:ticket.price
    ticket.set({
      title:req.body.title,
      price:req.body.price
    }) 
   await ticket.save()
   await new TicketUpdatedPublisher(natsWrapper.client).publish({
    id:ticket.id,
    version:ticket.version,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId

  })
  }
	res.status(200).send(ticket)
});

export { router as updateTicketRouter };
