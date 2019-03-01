import { V1ConfigMap, V1DeleteOptions, V1Job } from '@kubernetes/client-node';
import { Request, Response } from 'express';
import { JOB_NAME, TestAppJob } from '../config/job-details';
import k8sApi, { k8sBatchV1Api } from '../config/k8-api';
import { RUN_INIT_SH_CONFIG_NAME, RunInitShConfigMap } from '../config/run-init-sh-config-map';
import { RUN_JOB_CONFIGMAP_NAME, RunJobShConfigMap } from '../config/runjob-sh-config-map';


async function checkConfigMap() {
    let r1 = await createConfigMapIfDoesNotExist(RUN_JOB_CONFIGMAP_NAME, 'default', RunJobShConfigMap);
    let r2 = await createConfigMapIfDoesNotExist(RUN_INIT_SH_CONFIG_NAME, 'default', RunInitShConfigMap);
    // TODO convert to Promise.all
    return r2;
}


async function createConfigMapIfDoesNotExist(name: string, namespace: string, body: V1ConfigMap) {
    return k8sApi.readNamespacedConfigMap(name, namespace).catch(e => {
        if (e.body.code === 404) {
            console.log(`Config map ${name} does not exist, creating one `);
            return k8sApi.createNamespacedConfigMap(namespace, body);
        } else {
            throw e;
        }
    })
}

export const processCreateJob = () => {
// If job exists, display error message
    // Otherwise - create config map, create side car container, and then create job
    return k8sBatchV1Api.readNamespacedJob(JOB_NAME, 'default').then(r => {
        const job = r.body as V1Job;
        console.log(`Job ${job.metadata.name} already exists`);
        throw `job already exists`;
    }, () => {
        return createJob();
    })
};

export function createJobHandler(req: Request, res: Response) {
    processCreateJob().then(() => {
        console.log(`Job successfully created`);
        res.status(200).send({ message: `Job successfully created` });
    }).catch(e => {
        console.log(`Error in creating job`, e);
        res.status(400).send({ message: `Error creating the job` });
    });
}

function createJob() {
    return checkConfigMap().then(() => {
        console.log(`config map for the job exists, now creating the job.`);
        return k8sBatchV1Api.createNamespacedJob('default', TestAppJob);
    })
}

export const processDeleteJob = () => {
// ensure everything related to the job is deleted (for e.g. config map)
    return deleteConfigmapsForTheJob()
        .then(() => {
            return k8sBatchV1Api.deleteNamespacedJob(JOB_NAME, 'default', 'true', { propagationPolicy: 'Background' } as V1DeleteOptions);
        });
};

export function deleteJobHandler(req: Request, res: Response) {
    processDeleteJob().then(s => {
            res.send({ message: `Job successfully deleted` });
        })
        .catch(e => {
            res.status(400).send({ message: `Error in deleting the job`, e });
        });
}

function deleteConfigmapsForTheJob() {
    // TODO promise all, and not chain
    return deleteConfigMapIfExists(RUN_INIT_SH_CONFIG_NAME, 'default')
        .then(() => deleteConfigMapIfExists(RUN_JOB_CONFIGMAP_NAME, 'default'));
}

function deleteConfigMapIfExists(name: string, namespace: string) {
    return k8sApi.readNamespacedConfigMap(name, namespace).then(r =>
         k8sApi.deleteNamespacedConfigMap(name, namespace)
    ).catch(e => {
        if (e.body.code === 404) {
            console.log(`config map ${name} does not exist`);
            return true;
        } else {
            throw e;
        }
    })
}