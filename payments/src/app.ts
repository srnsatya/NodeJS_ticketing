import express from 'express'
import 'express-async-errors'
import {json } from 'body-parser'
import cookieSession from 'cookie-session'
import { errorHandler ,NotFoundError ,currentUserHandler} from '@myticketingdev/common'
import { createChargeRouter } from './routes/payment-created'
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

// app.get('*',async (req,res,next)=>{
// 	next( new NotFoundError())	
// })
app.use(createChargeRouter)

app.get('/api/payments/hello',(req,res)=>{
	console.log('hello to payments')
	res.status(200).send('hello to payments')
})
app.all('*',async (req,res)=>{
	throw new NotFoundError()
})

app.use(errorHandler)


export {app}