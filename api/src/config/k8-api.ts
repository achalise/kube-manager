import * as k8s from '@kubernetes/client-node';

export class PatchedK8sApi extends k8s.Core_v1Api {
    patchNamespacedReplicationControllerScale(...args) {
        this.defaultHeaders = {
            "Content-Type": "application/strategic-merge-patch+json",
            ...this.defaultHeaders,
        };
        return super.patchNamespacedReplicationControllerScale.apply(this, args);
    }
}

export const kubeConfig = new k8s.KubeConfig();
kubeConfig.loadFromDefault();


export const k8sPatchedApi = kubeConfig.makeApiClient(PatchedK8sApi);
const k8sApi = kubeConfig.makeApiClient(k8s.Core_v1Api);

export const k8sBatchV1Api = kubeConfig.makeApiClient(k8s.Batch_v1Api);

export default k8sApi;