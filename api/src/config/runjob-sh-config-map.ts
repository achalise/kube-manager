import { V1ConfigMap, V1ObjectMeta } from '@kubernetes/client-node';

const script = `echo RUNNING the task 
                echo FILES WRITTEN TO BY INIT JOB
                ls -la /opt/shared
                cat /opt/shared/.shareddata`;
export const RUN_JOB_CONFIGMAP_NAME = 'runsh';
export const RunJobShConfigMap = {
    apiVersion: 'v1',
    kind: 'ConfigMap',
    metadata: {name: RUN_JOB_CONFIGMAP_NAME} as V1ObjectMeta,
    data: {'run.sh': script}
} as unknown as V1ConfigMap;