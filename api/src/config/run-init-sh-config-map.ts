import { V1ConfigMap, V1ObjectMeta } from '@kubernetes/client-node';

const script = `echo RUNNING the init task 
                echo USERID=cassandra > /opt/shared/.shareddata`;
export const RUN_INIT_SH_CONFIG_NAME = 'initsh';
export const RunInitShConfigMap: V1ConfigMap = {
    apiVersion: 'v1',
    kind: 'ConfigMap',
    metadata: {name: RUN_INIT_SH_CONFIG_NAME} as V1ObjectMeta,
    data: {'run.sh': script},
    binaryData: {}
};