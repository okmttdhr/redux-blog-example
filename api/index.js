/* eslint-env node */
import express from 'express';
import bodyParser from 'body-parser';

// JsonWebToken
import jwt from 'express-jwt';

import jsonServer from 'json-server';
import config from './config';
import jwtToken from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import _ from 'lodash';

const jsonPath = path.join(__dirname, 'data.json');
const app = express();

app.use(jsonServer.defaults);
app.use(bodyParser.json());
app.use(jwt({
  secret: config.token.secret
}).unless(req => {
  const url = req.originalUrl;
  const postsRE = /^\/posts(\/.*)?$/;

  return (
      url === '/signup' ||
      url === '/login' ||
      (postsRE).test(url) && req.method === 'GET'
  );
}));

function generateToken(email, password) {
  const payload = { email, password };
  return jwtToken.sign(payload, config.token.secret, {
    expiresInMinutes: config.token.expires
  });
}

function extractToken(header) {
  return header.split(' ')[1];
}

// here comes the real hardcode
const HARDCODED_EMAIL = 'email@adress';
const HARDCODED_PASSWORD = 'pass';
const HARDCODED_USER = {
  id: 4,
  email: 'email@adress',
  password: 'pass'
};

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === HARDCODED_EMAIL && password === HARDCODED_PASSWORD) {
    const token = generateToken(email, password);
    const user = HARDCODED_USER;
    res.send({ token, user });
  } else {
    res.sendStatus(401);
  }
});

// プロフィールをGET
app.get('/profile', (req, res) => {
  try {
    const token = extractToken(req.headers.authorization);
    const decode = jwtToken.decode(token);
    const { email } = decode;

    // data.jsonのusersを読み込んでいる
    fs.readFile(jsonPath, {
      encoding: 'utf-8'
    }, (error, db) => {

      // data.jsonのusersをオブジェクトとして取り出している
      const users  = (JSON.parse(db)).users;

      // emailが一致するものをlodashでfind
      const user = _.find(users, (user) => user.email === email);

      res.send(user);

    });

  } catch (error) {
    res.sendStatus(401);
  }
});

// プロフィール更新
app.put('/profile', (req, res) => {
  try {
    const token = extractToken(req.headers.authorization);
    const decode = jwtToken.decode(token);
    const { email } = decode;

    fs.readFile(jsonPath, {
      encoding: 'utf-8'
    }, (error, db) => {
      let editedUser;

      const json = JSON.parse(db);

      const users  = json.users.map(user => {
        if (user.email === email) {
          return (editedUser = { ...user, ...req.body });
        }

        return user;
      });

      // ユーザーがいなければ成立しない => エラーを返す
      if (!editedUser) res.sendStatus(404);

      // userの箇所だけ更新してやる
      json.users = users;

      // jsonファイルを更新
      fs.writeFile(jsonPath, JSON.stringify(json, null, '  '), err => {
        if (err) return res.sendStatus(500);

        res.send(editedUser);
      });

    });
  } catch (error) {
    res.sendStatus(401);
  }
});

// data.jsonをサーバーとして使う
app.use(jsonServer.router(jsonPath));

app.listen(1337);
