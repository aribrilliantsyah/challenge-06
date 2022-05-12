const request = require('supertest')
const app = require('../app')
const prefix = '/api/v1/'
const controller = 'user-game'
const path = `${prefix}${controller}` 
const { QueryTypes } = require('sequelize')
const { sequelize } = require('../models')

let token = '';

describe('User Game API Test', () => {
  beforeAll(async () => {
    let account = {
      "username": "ariganteng11",
      "password": "rahasia"
    }
    
    const register = await request(app).post(`${prefix}/register`).send(account)
    const response = await request(app).post(`${prefix}/login`).send(account)
    token = response.body?.data?.token;
  });

  afterAll(async () => {
    try {
      await sequelize.query("TRUNCATE user_game, user_game_biodata, user_game_history RESTART IDENTITY;", { type: QueryTypes.RAW });
    } catch (error) {
      console.log(error)
    }
  });

  test(`GET ${path} - Success Get all `, async() => {
    const { body, statusCode } = await request(app).get(`${path}`)
      .set({
        Authorization: `Bearer ${token}`
      })
    expect(statusCode).toEqual(200)
    expect(body.message).toEqual('Success')
  })

  test(`GET ${path} - Success Get find one `, async() => {
    const { body, statusCode } = await request(app).get(`${path}/1`)
      .set({
        Authorization: `Bearer ${token}`
      })
    expect(statusCode).toEqual(200)
    expect(body.message).toEqual('Success')
  })
})