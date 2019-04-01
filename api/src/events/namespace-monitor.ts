import { V1ReplicationController } from '@kubernetes/client-node';
import * as k8s from '@kubernetes/client-node';
import { kubeConfig } from '../config/k8-api';

const watch = new k8s.Watch(kubeConfig);


let watchResources = (resourcelink: any, handler?: any) => {
    const req = watch.watch(resourcelink,
        // optional query parameters can go here.
        {}, handler ||
        // callback is called for each received object.
        ((type, obj: V1ReplicationController) => {
            if (type === 'ADDED') {
                console.log('new object:', obj.metadata.name);
            } else if (type === 'MODIFIED') {
                // tslint:disable-next-line:no-console
                console.log('changed object:', obj.metadata.name);
            } else if (type === 'DELETED') {
                // tslint:disable-next-line:no-console
                console.log('deleted object:', obj.metadata.name);
            } else {
                // tslint:disable-next-line:no-console
                console.log('unknown type: ' + type);
            }
            // tslint:disable-next-line:no-console
        }),
        // done callback is called if the watch terminates normally
        (err) => {
            // tslint:disable-next-line:no-console
            console.log(`err` + err);
        });
    return req;
};

export function watchNamespaces() {
    const req = watchResources('/api/v1/replicationcontrollers');

    setTimeout(() => { req.abort(); }, 60 * 1000 * 1000);
}