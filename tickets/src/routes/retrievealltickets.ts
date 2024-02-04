import express, { Request, Response } from 'express';
import { requireAuthHandler, validationHandler } from '@myticketingdev/common';
import { body} from 'express-validator';
import { Ticket } from '../models/ticket';
import { NotFoundError } from '@myticketingdev/common';
const router = express.Router();

router.get('/api/tickets', async(req: Request, res: Response) => {
	const tickets = await Ticket.find({	})
	if(!tickets){
			throw new NotFoundError()
	}
	res.send(tickets)
});

export { router as retrieveAllTickets };
