
import { app } from "../app"
import request  from 'supertest'

it('check of cookies  on  signout',async()=>{
	await request(app)
				.post('/api/users/signup')
				.send({
					email: 'abcaa@test1.com',
					password: 'abcaa'
				})
				.expect(201)

	const response2 =await request(app)
					.post('/api/users/signin')
					.send({
						email: 'abcaa@test1.com',
						password: 'abcaa1'
					})
					.expect(400)
	const response =await request(app)
					.post('/api/users/signin')
					.send({
						email: 'abcaa@test1.com',
						password: 'abcaa'
					})
					.expect(200)
	console.log('check cookies on signin=',response.get('Set-Cookie'))
	expect(response.get('Set-Cookie')).toBeDefined()

	const responsesignout =await request(app)
	.post('/api/users/signout')
	.send({
	})
	.expect(200)
	console.log('check cookies on signout=',responsesignout.get('Set-Cookie'))
	expect(response.get('Set-Cookie')).toBeDefined()
})