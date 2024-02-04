import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app)
  .post('/api/tickets')
  .set('Cookie',global.globalSignupCookie())
  .send({});
  console.log('/api/tickets not 404 ',response.status)
  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
 // const response = await request(app).get('/api/tickets/hello').send({});
 // console.log('/api/tickets/hello',response.status)
 const response = await request(app).post('/api/tickets').send({});
 console.log('if the user is not signed in',response.status)
 expect(response.status).toEqual(401);
});
it('can  be accessed if the user is signed in', async () => {
  // const response = await request(app).get('/api/tickets/hello').send({});
  // console.log('/api/tickets/hello',response.status)
  const response = await request(app)
  .post('/api/tickets')
  .set('Cookie',globalSignupCookie())
  .send({});
  console.log(' user is signed in',response.status)
  expect(response.status).not.toEqual(401);
 });
it('returns an error if an invalid title is provided', async () => {
  const response = await request(app)
  .post('/api/tickets')
  .set('Cookie',globalSignupCookie())
  .send({
    title:'',
    price:-110

  }).expect(400);
  console.log(' invalid request response',response.body)
});

it('returns an error if an invalid price is provided', async () => {
  const response = await request(app)
  .post('/api/tickets')
  .set('Cookie',globalSignupCookie())
  .send({
    title:'movies tickets',
    price:'100rupees'

  }).expect(400);
  console.log(' invalid request response',response.body)
});


it('creates a ticket with valid inputs', async () => {
  const response = await request(app)
  .post('/api/tickets')
  .set('Cookie',globalSignupCookie())
  .send({
    title:'movies tickets',
    price:400

  }).expect(201);
  console.log(' valid request response',response.body)

});

it('creates a ticket with valid inputs check moongo db is updated', async () => {
  let tickets = await Ticket.find({})
  console.log('tickets.length-1:',tickets.length)
  expect(tickets.length).toEqual(0)
  const response = await request(app)
  .post('/api/tickets')
  .set('Cookie',globalSignupCookie())
  .send({
    title:'movies tickets',
    price:400

  }).expect(201);
  console.log(' valid request response',response.body)
   tickets = await Ticket.find({})
   console.log('tickets.length-2:',tickets.length)
   expect(tickets.length).toEqual(1)
   expect(tickets[0].price).toEqual(400)
   expect(tickets[0].title).toEqual('movies tickets')
});

it('publish the event ', async () => {
  const response = await request(app)
  .post('/api/tickets')
  .set('Cookie',globalSignupCookie())
  .send({
    title:'movies tickets',
    price:400

  }).expect(201);
  console.log(natsWrapper)
  expect(natsWrapper.client.publish).toHaveBeenCalled()
 
})