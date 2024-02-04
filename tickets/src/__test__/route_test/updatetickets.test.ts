import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose  from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
it(' ticket is not present with that id', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  console.log("generated id:",id)
  const response = await request(app)
  .put(`/api/tickets/${id}`)
  .set('Cookie',global.globalSignupCookie())
  .send({
    title:'test',
    price:60
  });
  console.log('/api/tickets not 404 ',response.status)
  expect(response.status).toEqual(404);
});


it('401 not autherised -can only be accessed only if the user is signed in other wise - 401', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  console.log("generated id:",id)
  const response = await request(app).put(`/api/tickets/${id}`)
  .send({  title:'test',
  price:60});
  console.log('/api/tickets if the user is not signed in',response.status)
  expect(response.status).toEqual(401);
 });
 it('401 not autherised - if ticket owner is different', async () => {
  const createTicket = await request(app)
  .post('/api/tickets')
  .set('Cookie',globalSignupCookieP('abc','abc@abc.com'))
  .send({
    title:'abc-movies1 tickets',
    price:900

  }).expect(201);
  console.log(' create request response',createTicket.body)

  const putresponse = await request(app)
  .put(`/api/tickets/${createTicket.body.id}`)
  .set('Cookie',global.globalSignupCookie())
  .send({
    title:'pqr-movies1 tickets',
    price:1000
  });
  console.log('put /api/tickets response',putresponse.status)
  console.log('put  request response',putresponse.body)
  expect(putresponse.status).toEqual(401);
 
 });


 it('Mandatory attribute check case-  ticket is present with that id & do put and matches', async () => {
  const createTicket = await request(app)
  .post('/api/tickets')
  .set('Cookie',globalSignupCookie())
  .send({
    title:'Mandatory tickets',
    price:400

  }).expect(201);
  console.log(' create request response',createTicket.body)
  const putresponse = await request(app)
  .put(`/api/tickets/${createTicket.body.id}`)
  .set('Cookie',global.globalSignupCookie())
  .send({
    title:'',
    price:'bbb'
  });
  console.log('Mandatory put /api/tickets response',putresponse.status)
  console.log('Mandatory put  request response',putresponse.body)
  expect(putresponse.status).toEqual(400);
});


it('IT should fail if ticket is reserved by a order', async () => {
  const createTicket = await request(app)
  .post('/api/tickets')
  .set('Cookie',globalSignupCookie())
  .send({
    title:'movies tickets',
    price:400

  }).expect(201);
  console.log(' create  reserved by a order response',createTicket.body)
  const ticket=await Ticket.findById(createTicket.body.id)
  ticket!.set({orderId:new mongoose.Types.ObjectId().toHexString()})
  await ticket!.save()
  const newtitle = 'reserved Order fail'
  const newprice = 1000
  const putresponse = await request(app)
  .put(`/api/tickets/${createTicket.body.id}`)
  .set('Cookie',global.globalSignupCookie())
  .send({
    title:newtitle, price:newprice
  });
  console.log('put /api/tickets response',putresponse.status)
  console.log('put  request response',putresponse.body)
  expect(putresponse.status).toEqual(400);

});

 
it('Success case-  ticket is present with that id & do put and matches', async () => {
  const createTicket = await request(app)
  .post('/api/tickets')
  .set('Cookie',globalSignupCookie())
  .send({
    title:'movies tickets',
    price:400

  }).expect(201);
  console.log(' create request response',createTicket.body)
  const newtitle = 'newtitle'
  const newprice = 1000
  const putresponse = await request(app)
  .put(`/api/tickets/${createTicket.body.id}`)
  .set('Cookie',global.globalSignupCookie())
  .send({
    title:newtitle, price:newprice
  });
  console.log('put /api/tickets response',putresponse.status)
  console.log('put  request response',putresponse.body)
  expect(putresponse.status).toEqual(200);

  const getresponse = await request(app)
  .get(`/api/tickets/${createTicket.body.id}`)
  .send({
  });
  console.log('getresponse:',getresponse.body)

  expect(getresponse.body.title).toEqual(newtitle);
  expect(getresponse.body.price).toEqual(newprice);
});


it('Success case-  Verify the NATS executed or not', async () => {
  const createTicket = await request(app)
  .post('/api/tickets')
  .set('Cookie',globalSignupCookie())
  .send({
    title:'movies tickets',
    price:400

  }).expect(201);
  console.log(' create request response',createTicket.body)
  const newtitle = 'newtitle'
  const newprice = 1000
  const putresponse = await request(app)
  .put(`/api/tickets/${createTicket.body.id}`)
  .set('Cookie',global.globalSignupCookie())
  .send({
    title:newtitle, price:newprice
  });
  console.log('put /api/tickets response',putresponse.status)
  console.log('put  request response',putresponse.body)
  expect(putresponse.status).toEqual(200);

  const getresponse = await request(app)
  .get(`/api/tickets/${createTicket.body.id}`)
  .send({
  });
  console.log('getresponse:',getresponse.body)

  expect(getresponse.body.title).toEqual(newtitle);
  expect(getresponse.body.price).toEqual(newprice);
  expect(natsWrapper.client.publish).toHaveBeenCalled()
});