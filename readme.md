TODO:

1. run the manager inside cluster by creating a deployment

## Running locally outside cluster

* Start minikube: `minikube start`
* Start kube api proxy: `kubectl proxy --port=8080 &`
* Start the kube-watcher app: `npm run watch`
* create custom resource def: `kubectl create -f config/crd/custom-app-crd.yaml`
* should be able to see the crd: `kubectl get crds`
* create custom resource: `kubectl create -f config/crd/custom-app.yaml`
* should be able to see the custom app: `kubectl get testapps`
* `cassandra` instance and `testappjob` instance should be launched and running as a result of custom app being created
* delete custom resource: `kubectl delete -f config/crd/custom-app.yaml`
* custom app should be deleted: `kubectl get testapps` should show no items
* `cassandra` instance and `testappjob` instance should be removed as a result of custom app being deleted