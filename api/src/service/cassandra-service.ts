import {
    V1ObjectMeta,
    V1ReplicationControllerSpec,
    V1Service,
    V1ServicePort,
    V1ServiceSpec
} from '@kubernetes/client-node';
import * as http from 'http';
import { cassandraReplicationController } from '../config/cassandra-replication-controller';
import k8sApi, { k8sPatchedApi } from '../config/k8-api';

const retrieveService = (): Promise<{ response: http.IncomingMessage, body: V1Service }> => {
     return k8sApi.readNamespacedService('cassandra', 'default');
};


const createCassandraRC = () => {
    return k8sApi.createNamespacedReplicationController('default', cassandraReplicationController).catch(e => console.log(`Error in creating cassandra rc ${e}`));
}

const deleteCassandraRC = () => {
    return k8sPatchedApi.patchNamespacedReplicationControllerScale('cassandra', 'default',
        { spec: { replicas: 0 } } as unknown as V1ReplicationControllerSpec).then(() =>
        executeDeleteCassandra()).catch((e: any) => console.log(`Error deleting rc`));
}


const executeDeleteCassandra = () => {
    return new Promise((rs, rj) => {
        setTimeout(() => {
            rs(k8sApi.deleteNamespacedReplicationController('cassandra', 'default'));
        }, 2000);
    });
}

const deleteService = () => {
    return k8sApi.deleteNamespacedService('cassandra', 'default');
};

const createService = () => {
    return k8sApi.createNamespacedService('default', cassandraService());
};

function cassandraService() {
    let service = {} as V1Service;
    service.kind = 'Service';
    service.apiVersion = 'v1';
    service.metadata = metaData('cassandra');
    service.spec = cassandraSpec();
    return service;
}

function cassandraSpec() {
    let spec = {} as V1ServiceSpec;
    spec.ports = [ { port: 9042 } as V1ServicePort ];
    spec.selector = { app: 'cassandra' };
    spec.type = 'NodePort';
    return spec;
}

function metaData(appname: string) {
    let md = {} as V1ObjectMeta;
    md.labels = { app: appname };
    md.name = appname;
    return md;
}

export {
    retrieveService,
    deleteService,
    createService,
    createCassandraRC,
    deleteCassandraRC
}