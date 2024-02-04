import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose  from 'mongoose';

const createTicket = ( title: String, price: Number) =>{
  return  request(app)
  .post('/api/tickets')
  .set('Cookie',globalSignupCookie())
  .send({
    title,
    price

  })
}

it('fetch all list of tickets', async () => {
  await createTicket('Movie1',100)
  await createTicket('Movie2',200)
  await createTicket('Movie3',300)

  const allticketResponse = await request(app)
  .get(`/api/tickets`)
  .send()
  .expect(200);
console.log(' valid get all response',allticketResponse.body)

expect(allticketResponse.body.length).toEqual(3)
});

