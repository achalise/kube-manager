import {
    V1Container,
    V1ContainerPort,
    V1EnvVar,
    V1EnvVarSource,
    V1HostPathVolumeSource,
    V1ObjectFieldSelector,
    V1ObjectMeta,
    V1PodSpec,
    V1PodTemplateSpec,
    V1ReplicationController,
    V1ReplicationControllerSpec,
    V1Volume,
    V1VolumeMount
} from '@kubernetes/client-node';

const dataStaxContainer = {
    image: 'datastax/dse-server',
    name: 'cassandra',
    ports: [
        { containerPort: 7000, name: 'intra-node' } as V1ContainerPort,
        { containerPort: 7001, name: 'tls-intra-node' } as V1ContainerPort,
        { containerPort: 7199, name: 'jmx' } as V1ContainerPort,
        { containerPort: 9042, name: 'cql' } as V1ContainerPort,
    ],
    volumeMounts: [
        { name: 'data', mountPath: '/cassandra-data' } as V1VolumeMount
    ],
    env: [
        { name: 'MAX_HEAP_SIZE', value: '512M' } as V1EnvVar,
        { name: 'HEAP_NEWSIZE', value: '100M' } as V1EnvVar,
        {
            name: 'POD_NAMESPACE',
            valueFrom: { fieldRef: { fieldPath: 'metadata.namespace' } as V1ObjectFieldSelector } as V1EnvVarSource
        } as V1EnvVar,
        {
            name: 'POD_IP',
            valueFrom: { fieldRef: { fieldPath: 'status.podIP' } as V1ObjectFieldSelector } as V1EnvVarSource
        } as V1EnvVar,
        { name: 'DS_LICENSE', value: 'accept' } as V1EnvVar,
    ]
} as V1Container;

const podTemplateSpec = {
    containers: [ dataStaxContainer ],
    volumes: [
        { hostPath: { path: '/Users/achalise/devtools/data/cassandra'} as V1HostPathVolumeSource, name: 'data' } as V1Volume
    ]
} as V1PodSpec;

const template = {
    metadata: { labels: { app: 'cassandra' } } as V1ObjectMeta,
    spec: podTemplateSpec
} as V1PodTemplateSpec;

const spec = {
    replicas: 1,
    template: template
} as V1ReplicationControllerSpec;


export const cassandraReplicationController = {
    apiVersion: 'v1',
    kind: 'ReplicationController',
    metadata: { name: 'cassandra' } as V1ObjectMeta,
    spec: spec,
} as V1ReplicationController;