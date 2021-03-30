require('dotenv').config();

const express = require('express');
const cluster = require( 'cluster' );
const bodyParser = require('body-parser');

const cors = require('cors');
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const path = require('path');
const PORT = process.env.PORT || 5000;
const cCPUs   = require('os').cpus().length;
const { ERROR_500 } = require('./config/errorCodes');

const routes = require('./routes');
const authenticate = require('./authenticate');

if(cluster.isMaster ) {
  // Create a worker for each CPU
  for( let i = 0; i < cCPUs; i++ ) {
    cluster.fork();
  }
  cluster.on( 'online', ( worker ) => {
    console.log( 'Worker ' + worker.process.pid + ' is online.' );
  });
  cluster.on( 'exit', ( worker, code, signal ) => {
    console.log( 'worker ' + worker.process.pid + ' died.' );
    cluster.fork();
  });
}
else {

  const app = express();

  const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 300 // limit each IP to 100 requests per windowMs
  });
  app.use(limiter);
  // app.use(helmet());
  app.use(cors());

  app.use(express.json({limit: '50mb'}));

  app.use('/api/auth',routes.authRoute);
  app.use('/api/ad', authenticate, routes.adRoute);

  app.use('/api/admin/auth', routesAdmin.authRoute);
  app.use('/api/admin/dashboard', routesAdmin.dashboardRoute);

  app.use((err, req, res, next) => {
    res.status(500).send({
      ...ERROR_500,
      msg: err
    })
  });


  app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
  });
}
