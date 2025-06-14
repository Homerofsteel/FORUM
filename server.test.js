const request = require('supertest');
const express = require('express');
const { setCookie, getCookie, clearCookie, cookieParser } = require('./utils/cookieManager.js');
const {
  getAllThreads,
  getAllThreadIds,
  getThreadById,
  getThreadsbyCategory,
  createThread
} = require('./public/js/threads.js');

const app = require('./server');

describe('Server API Endpoints', () => {

  beforeAll(() => {
    app.use(express.json());
    app.use(cookieParser());
  });

});
