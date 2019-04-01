import { V1Status } from '@kubernetes/client-node';
import { Request, Response } from 'express';
import * as cassandraService from '../service/cassandra-service';

export function cassandraHandler(req: Request, res: Response) {

    console.log(`set up watch`);

    let message = `cassandra works`;
    cassandraService.retrieveService()
        .catch(e => {
            console.log(`Error creating cassandra service`, e);
            let err = e.response.body as V1Status;
            console.log(err);
            if (err.code === 404) {
                return cassandraService.createService();
            }
        }).catch(e => {
            console.log(e);
    });


    res.send({ message })
}

export function cassandraDeleteHandler(req: Request, res: Response) {
    console.log(`Deletting service`, req.body);
    cassandraService.deleteService().then(r => console.log(r.response)).catch(e => console.log(`Delete service request unsuccessful`, e));
    const message = `Request completed`;
    res.send({ message });
}

export function cassandraCreateRCHandler(req: Request, res: Response) {
    console.log(`Creating cassandra Replication Controller`);
    cassandraService.createCassandraRC().catch(e => console.log(`Error creating cassandra RC`, e));
    res.send(`create cassandra rc completed`);
}

export function cassandraDeleteRCHandler(req: Request, res: Response) {
    console.log(`Deleting cassandra Replication Controller`);
    cassandraService.deleteCassandraRC().catch((e: any) => console.log(`Error deleting cassandra RC`, e));
    res.send(`delete cassandra rc completed`);
}