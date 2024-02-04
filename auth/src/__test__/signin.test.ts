
import { app } from "../app"
import request  from 'supertest'

it('returns 400 on incorrect email / password',async()=>{
	return request(app)
					.post('/api/users/signin')
					.send({
						email: 'test@tes11111t.com',
						password: 'testtest11111'
					})
					.expect(400)
})
it('returns 201 on success signup',async()=>{
	return request(app)
					.post('/api/users/signup')
					.send({
						email: 'test1212@test.com',
						password: 'testtest'
					})
					.expect(201)
})

it('check of cookies  on signin / signout',async()=>{
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

})