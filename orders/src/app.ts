import express from 'express'
import 'express-async-errors'
import { createTicketRouter } from './routes/issueorders';
import {json } from 'body-parser'
import cookieSession from 'cookie-session'
import { errorHandler ,NotFoundError ,currentUserHandler} from '@myticketingdev/common'
import { findOrderRouter } from './routes/showorders';
import { retrieveAllOrders } from './routes/retrieveallorders';
import { updateTicketRouter } from './routes/updateorders';
import { deleteOrdersRouter } from './routes/deleteorders';
// customer imports
const app = express()
app.set('trust proxy',true)
app.use(json())
app.use( cookieSession({
	signed:false,
	secure:process.env.NODE_ENV !== 'test'
})
)
app.use(currentUserHandler)
app.use(createTicketRouter)
app.use(findOrderRouter)
app.use(retrieveAllOrders)
app.use(updateTicketRouter)
app.use(deleteOrdersRouter)
// app.get('*',async (req,res,next)=>{
// 	next( new NotFoundError())	
// })


app.get('/api/tickets/hello',(req,res)=>{
	console.log('hello to tickets')
	res.status(200).send('hello to tickets')
})
app.all('*',async (req,res)=>{
	throw new NotFoundError()
})

app.use(errorHandler)


export {app}