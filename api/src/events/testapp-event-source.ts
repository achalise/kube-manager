import * as k8s from '@kubernetes/client-node';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { kubeConfig } from '../config/k8-api';
import { CustomApi } from '../custom-api/custom-api';

const watch = new k8s.Watch(kubeConfig);

const testAppsPath = '/apis/example.com/v1/namespaces/default/testapps/';

const listFn = (fn: any) => {
    CustomApi.getTestApps().then((r: any) => {
        fn(r.data.items);
    }, err => {
        console.log(`Error received when watching test apps ${err}`);
    });
};

const testAppsCache = new k8s.ListWatch(testAppsPath, watch, listFn);

const myTestApp$ = new BehaviorSubject({metadata: {generation: -1}});
const distinctApps$ = myTestApp$.pipe(filter(x => !!x && x.metadata.generation > -1),
    distinctUntilChanged((one, two) => one.metadata.generation === two.metadata.generation));

export const testAppEventStream$ = distinctApps$.pipe(
    map(c => {
        if (c.metadata.generation > 0) {
            if (c.metadata.generation === 1) {
                return { type: 'CREATED', obj: c } as Action;
            } else {
                return { type: 'UPDATED', obj: c } as Action;
            }
        } else {
            return { type: 'DELETED' } as Action;
        }
    })
);

export const watchTestApps = () => {
    let myapp = testAppsCache.get('my-testapp');
    myTestApp$.next(myapp || {metadata: {generation: 0}});
    setTimeout(watchTestApps, 2000);
};

export interface Action {
    type: 'CREATED' | 'UPDATED' | 'DELETED',
    obj?: {}
}