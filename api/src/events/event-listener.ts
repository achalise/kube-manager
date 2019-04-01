import { processCreateJob, processDeleteJob } from '../controllers/job-controller';
import { createCassandraRC, deleteCassandraRC } from '../service/cassandra-service';
import { testAppEventStream$, watchTestApps } from './testapp-event-source';

testAppEventStream$.subscribe(e => {
    console.log(`Received event `, e.type);
    switch (e.type) {
        case 'CREATED':
            console.log(`Processing create testapp event ...`);
            createCassandraRC().then(() => processCreateJob()).catch(e => console.log(`error processing create event - ${e}`));
            return;
        case 'DELETED':
            console.log(`Processing delete testapp event, if it exists ..`);
            deleteCassandraRC().then(() => processDeleteJob())
                .then(() => console.log(`Completed processing delete testapp event`))
                .catch((e: any) => console.log(`error processing delete testapp as it does not exist`));
            return;
        case 'UPDATED':
            console.log(`should update`);
            return;
        default:
            console.log(`wrong type`);
    }
}, e => {
    console.log(`Error 2`);
});

export function processEvents() {
    setTimeout(watchTestApps, 3000);
}
