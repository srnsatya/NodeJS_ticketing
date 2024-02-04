
import { app } from "../app"
import request  from 'supertest'

it('returns 201 on success signup',async()=>{
	return request(app)
					.post('/api/users/signup')
					.send({
						email: 'test@test.com',
						password: 'testtest'
					})
					.expect(201)
})

it('returns 400 invalid email',async()=>{
	return request(app)
					.post('/api/users/signup')
					.send({
						email: 'testtest.com',
						password: 'testtest'
					})
					.expect(400)
})

it('returns 400 invalid password',async()=>{
	return request(app)
					.post('/api/users/signup')
					.send({
						email: 'test@test.com',
						password: 't'
					})
					.expect(400)
})


it('returns 400 invalid email & password',async()=>{
	await request(app)
					.post('/api/users/signup')
					.send({
						email: 'testtest.com',
						password: 'testtest'
					})
					.expect(400)

	await request(app)
					.post('/api/users/signup')
					.send({
						email: 'test@test.com',
						password: 't'
					})
					.expect(400)
})


it('Duplicate email check',async()=>{
	await request(app)
					.post('/api/users/signup')
					.send({
						email: 'test@test1.com',
						password: 'testtest'
					})
					.expect(201)

	await request(app)
					.post('/api/users/signup')
					.send({
						email: 'test@test1.com',
						password: 'testtest'
					})
					.expect(400)
})

it('check of cookies',async()=>{
	const response =await request(app)
					.post('/api/users/signup')
					.send({
						email: 'test@test2.com',
						password: 'testtest'
					})
					.expect(201)
	console.log('check cookies=',response.get('Set-Cookie'))
	expect(response.get('Set-Cookie')).toBeDefined()
})
