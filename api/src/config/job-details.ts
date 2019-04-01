import {
    V1ConfigMapVolumeSource,
    V1Container,
    V1ContainerPort,
    V1Job,
    V1JobSpec,
    V1ObjectMeta,
    V1PodSpec,
    V1PodTemplateSpec, V1Volume, V1VolumeMount
} from '@kubernetes/client-node';

import { RUN_INIT_SH_CONFIG_NAME } from './run-init-sh-config-map';
import { RUN_JOB_CONFIGMAP_NAME } from './runjob-sh-config-map';


export const JOB_NAME = 'testappjob';

const getSharedDataVolume = (): V1Volume => {
    return {name: 'shared-data', emptyDir: {}} as V1Volume;
};

const getRunInitContainerScriptConfigMapVolume = (): V1Volume => {
    return {name: 'runinitsh', configMap: {name: RUN_INIT_SH_CONFIG_NAME}} as V1Volume;
};

const initContainers = (): Array<V1Container> => {
    return [{
        imagePullPolicy: 'Always',
        name: 'init-test-app',
        image: `bitnami/nginx:latest`,
        volumeMounts: [
            {name: getRunInitContainerScriptConfigMapVolume().name, mountPath: `/opt/bin/`} as V1VolumeMount,
            {name: getSharedDataVolume().name, mountPath: `/opt/shared/`} as V1VolumeMount
        ],
        command: [`sh`, `/opt/bin/run.sh`]
    } as V1Container];
};

const jobTemplate = {
    metadata: { labels: { app: JOB_NAME } } as unknown as V1ObjectMeta,
    spec: {
        restartPolicy: 'Never',
        containers: [
            {
                image: `bitnami/nginx:latest`,
                name: JOB_NAME,
                imagePullPolicy: 'Always',
                ports: [
                    {containerPort: 8080} as V1ContainerPort
                ],
                volumeMounts: [
                    {name: 'runsh', mountPath: '/opt/jobs/bin'} as V1VolumeMount,
                    {name: getSharedDataVolume().name, mountPath: '/opt/shared'} as V1VolumeMount
                ],
                command: ['sh', '/opt/jobs/bin/run.sh']


            } as V1Container
        ],
        volumes: [
            {
                name: 'runsh',
                configMap: {name: RUN_JOB_CONFIGMAP_NAME} as V1ConfigMapVolumeSource

            } as V1Volume,
            getSharedDataVolume(),
            getRunInitContainerScriptConfigMapVolume()
        ],
        initContainers: initContainers()

    } as V1PodSpec
} as V1PodTemplateSpec;

function jobSpec() {
    return {
        template: jobTemplate
    } as V1JobSpec;
}

export const TestAppJob = {
    kind: 'Job',
    metadata: { name: JOB_NAME} as V1ObjectMeta,
    spec: jobSpec()
} as V1Job;