import express, { Request, Response } from 'express';
import { requireAuthHandler, validationHandler } from '@myticketingdev/common';
import { body} from 'express-validator';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';
const router = express.Router();

router.post('/api/tickets',requireAuthHandler,[
	body('price').isFloat({gt:0}).withMessage('price must be  greater than 0'),
	body('title').trim().isLength({min:4,max:20}).withMessage('title must be 4 to 20 characters')
],validationHandler, async(req: Request, res: Response) => {
	const {title,price} = req.body
   const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    await ticket.save();
    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id:ticket.id,
      version:ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId

    })
    res.status(201).send(ticket);

});

export { router as createTicketRouter };
