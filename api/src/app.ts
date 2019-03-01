import express from 'express';
import {
    cassandraCreateRCHandler,
    cassandraDeleteHandler,
    cassandraDeleteRCHandler,
    cassandraHandler
} from './controllers/cassandra-handler';
import { healthCheckHandler } from './controllers/health-check-handler';
import { createJobHandler, deleteJobHandler } from './controllers/job-controller';
import { processEvents } from './events/event-listener';

const app: express.Application = express();

app.get('/healthcheck', healthCheckHandler);
app.get('/cassandra', cassandraHandler);
app.get('/cassandraRC', cassandraCreateRCHandler);
app.get('/cassandraRCX', cassandraDeleteRCHandler);
app.post('/cassandra', cassandraDeleteHandler);


app.get('/createjob', createJobHandler);
app.get('/deletejob', deleteJobHandler);
app.get('/liveness', (req, res) => {
    res.send({ 'message:': 'live' })
});

processEvents();

export default app;