
import { app } from "../app"
import request  from 'supertest'

it('returns current User',async()=>{
	const cookie = await globalSignupCookie()
	const currentUserresponse =await request(app)
					.get('/api/users/currentuser')
					.set('Cookie',cookie)
					.send()
					.expect(200)
	
	console.log('current user body',currentUserresponse.body)
	expect(currentUserresponse.body.currentUser.email).toEqual('dummy1@mail.com')
})

it('returns current User',async()=>{
	const currentUserresponse =await request(app)
					.get('/api/users/currentuser')
					.send()
					.expect(200)
	
	console.log('current user body without signup',currentUserresponse.body)
//	expect(currentUserresponse.body.currentUser).toEqual(null)
})