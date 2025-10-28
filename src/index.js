require('module-alias/register');
require('express-async-errors');

const path = require('path');
const express = require('express');

const router_public = require('@/routers/public');
const ExtendRequestMiddleware = require('@/middlewares/ExtendRequestMiddleware');
const NotFoundMiddleware = require('@/middlewares/NotFoundMiddleware');
const ErrorMiddleware = require('@/middlewares/ErrorMiddleware');
const config = require('@/configs/config');
const logger = require('@/helpers/Logger');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(ExtendRequestMiddleware);

app.use(router_public);

app.use(NotFoundMiddleware);
app.use(ErrorMiddleware);

app.listen(config.PORT, () => {
  logger.info(`Example app listening on port ${config.PORT}`);
});

