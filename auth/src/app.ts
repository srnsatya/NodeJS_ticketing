import express from 'express'
import 'express-async-errors'
import {json } from 'body-parser'
import cookieSession from 'cookie-session'

// customer imports
import { currentUserRouter } from './routes/current-user'
import { signInRouter } from './routes/signin'
import { signUpRouter } from './routes/signup'
import { signOutRouter } from './routes/signout'
import { errorHandler ,NotFoundError } from '@myticketingdev/common'


const app = express()
app.set('trust proxy',true)
app.use(json())
app.use( cookieSession({
	signed:false,
	secure:process.env.NODE_ENV !== 'test'
})
)
app.use(currentUserRouter)
app.use(signInRouter)
app.use(signUpRouter)
app.use(signOutRouter)


// app.get('*',async (req,res,next)=>{
// 	next( new NotFoundError())	
// })
app.all('*',async (req,res)=>{
	throw new NotFoundError()
})

app.get('/api/users/hello',(req,res)=>{
	console.log('hello to auth')
	res.status(200).send('hello to auth')
})

app.use(errorHandler)


export {app}