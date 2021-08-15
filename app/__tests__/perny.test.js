const request = require('supertest')
const app = require('../../app')
const { doesNotThrow } = require('should')
// describe('get Endpoints', () => {
//   it('should get a msg', async () => {
//     const res = await request(app)
//       .get('/api/v1/admin/slider')
//     })
//   expect(res.status).toEqual(200)
//   expect(res.body.message).toBe('pass!')
//   done()
    
//   })
// it('gets the test endpoint', async done => {
//   const response = await request(app)
//   .post('/api/v1/admin/slider/5ee9ff48c145751bc0c2d2ab')
//   .send({
//     image: "fln", parentType:"Product", parent:"5ee9dbba586eca0cbc1f4c18"})
  

//   expect(response.status).toBe(200)
  
//   done()
// })
// it('sign up user', async done => {
//   const response = await request(app)
//   .post('/api/v1/signup')
//   .send({phoneNumber:"09308140275"})
  

  
//   expect(response.status).toBe()
  
//   done()
// })
