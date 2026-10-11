import { after, before, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';

// Tests never load backend/.env or MONGODB_URI, so they cannot connect to the developer database.
let mongo;
before(async () => {
  if (process.env.TEST_MONGODB_URI) {
    let databaseName;
    try { databaseName = decodeURIComponent(new URL(process.env.TEST_MONGODB_URI).pathname.replace(/^\//, '')); }
    catch { throw new Error('TEST_MONGODB_URI must be a valid MongoDB URI for expense_tracker_test.'); }
    if (databaseName !== 'expense_tracker_test') throw new Error('TEST_MONGODB_URI must use a database named exactly expense_tracker_test.');
    await mongoose.connect(process.env.TEST_MONGODB_URI);
  } else {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri('expense_tracker_test'));
  }
});
beforeEach(async () => { await mongoose.connection.db.dropDatabase(); });
after(async () => { await mongoose.disconnect(); if (mongo) await mongo.stop(); });

describe('Expense API', () => {
  it('reports health', async () => {
    const response = await request(app).get('/api/health').expect(200);
    assert.equal(response.body.data.status, 'ok');
  });
  it('creates, lists, summarizes, updates, and deletes an expense', async () => {
    const created = await request(app).post('/api/expenses').send({ description: 'Coffee', amount: 4.5, category: 'Food & Dining', date: '2026-10-11' }).expect(201);
    const id = created.body.data._id;
    assert.equal((await request(app).get('/api/expenses').expect(200)).body.data.length, 1);
    assert.equal((await request(app).get('/api/expenses/summary').expect(200)).body.data.total, 4.5);
    await request(app).put(`/api/expenses/${id}`).send({ description: 'Tea' }).expect(200);
    await request(app).delete(`/api/expenses/${id}`).expect(200);
    assert.equal((await request(app).get('/api/expenses').expect(200)).body.data.length, 0);
  });
  it('returns a clear validation error for invalid input', async () => {
    const response = await request(app).post('/api/expenses').send({ description: '', amount: -1, category: 'Nope' }).expect(400);
    assert.equal(response.body.success, false);
    assert.match(response.body.error.message, /Description/);
  });
  it('supports search and category filters', async () => {
    await request(app).post('/api/expenses').send({ description: 'Market run', amount: 18, category: 'Food & Dining' }).expect(201);
    await request(app).post('/api/expenses').send({ description: 'Bus ticket', amount: 3, category: 'Transportation' }).expect(201);
    assert.equal((await request(app).get('/api/expenses?search=market').expect(200)).body.data.length, 1);
    assert.equal((await request(app).get('/api/expenses?category=Transportation').expect(200)).body.data.length, 1);
  });
});
