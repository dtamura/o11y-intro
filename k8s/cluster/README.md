

```sh
kind create cluster --config config.yaml

```

```sh

# Charts
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add open-telemetry https://open-telemetry.github.io/opentelemetry-helm-charts
helm repo add jetstack https://charts.jetstack.io --force-update
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

# Prom
helm upgrade --install prometheus prometheus-community/kube-prometheus-stack --version 66.2.1 --create-namespace -n prometheus \
  --set grafana.enabled=false \
  --set prometheus.prometheusSpec.scrapeInterval=5s \
  --set prometheus.prometheusSpec.scrapeTimeout=5s \
  --set "prometheus.prometheusSpec.enableFeatures={exemplar-storage,otlp-write-receiver}" \
  --set prometheus.prometheusSpec.enableRemoteWriteReceiver=true \
  --set prometheus.prometheusSpec.logLevel=info \
  --set prometheus.prometheusSpec.remoteWriteDashboards=true \
  --set "prometheus.prometheusSpec.additionalScrapeConfigs[0].job_name=otelcol" \
  --set "prometheus.prometheusSpec.additionalScrapeConfigs[0].static_configs[0].targets={collector-with-ta-collector-monitoring.otelcol.svc:8888}" 


# Cert-Manager
kubectl create ns cert-manager
helm upgrade --install cert-manager jetstack/cert-manager --namespace cert-manager --version v1.16.2 \
  --set crds.enabled=true

# Otel-Operator
kubectl create ns otel-operator
helm upgrade --install otel-operator open-telemetry/opentelemetry-operator --version 0.74.2 -n otel-operator \
  --set "manager.collectorImage.repository=otel/opentelemetry-collector-k8s"

# Loki
helm upgrade --install loki grafana/loki --version 6.19.0 --create-namespace -n loki -f loki-values.yaml \
  --set test.prometheusAddress=http://prometheus-kube-prometheus-prometheus.prometheus.svc:9090


# Grafana 
kubectl create configmap dashboards -n grafana \
  --from-file=dashboards/alertmanager-overview.json \
  --from-file=dashboards/apiserver.json \
  --from-file=dashboards/cluster-total.json \
  --from-file=dashboards/grafana-overview.json \
  --from-file=dashboards/k8s-coredns.json \
  --from-file=dashboards/k8s-resources-cluster.json \
  --from-file=dashboards/k8s-resources-multicluster.json \
  --from-file=dashboards/k8s-resources-namespace.json \
  --from-file=dashboards/k8s-resources-node.json \
  --from-file=dashboards/k8s-resources-pod.json \
  --from-file=dashboards/k8s-resources-workload.json \
  --from-file=dashboards/k8s-resources-workloads-namespace.json \
  --from-file=dashboards/kubelet.json \
  --from-file=dashboards/namespace-by-pod.json \
  --from-file=dashboards/namespace-by-workload.json \
  --from-file=dashboards/node-cluster-rsrc-use.json \
  --from-file=dashboards/node-rsrc-use.json \
  --from-file=dashboards/nodes-aix.json \
  --from-file=dashboards/nodes-darwin.json \
  --from-file=dashboards/nodes.json \
  --from-file=dashboards/persistentvolumesusage.json \
  --from-file=dashboards/pod-total.json \
  --from-file=dashboards/prometheus.json \
  --from-file=dashboards/proxy.json \
  --from-file=dashboards/scheduler.json \
  --from-file=dashboards/workload-total.json

helm upgrade --install grafana grafana/grafana --version 8.5.12 --create-namespace -n grafana -f grafana-values.yaml \
  --set persistence.enabled=true \
  --set "plugins={grafana-opensearch-datasource}" \
  --set assertNoLeakedSecrets=false


# Grafana Tempo
helm upgrade --install tempo grafana/tempo --version 1.14.0 --create-namespace -n grafana-tempo \
    --set tempo.reportingEnabled=false \
    --set tempo.metricsGenerator.enabled=true \
    --set "tempo.metricsGenerator.config.storage.remote_write[0].url=http://prometheus-kube-prometheus-prometheus.prometheus.svc:9090/api/v1/write" \
    --set tempo.retention=8760h \
    --set persistence.enabled=true \
    --set serviceMonitor.enabled=true \
    --set serviceMonitor.addtionalLabels.release=prometheus-stack



# OTel Collector
kubectl create ns otelcol
kubectl apply -f otelcol-crd-main.yaml -n otelcol
kubectl apply -f otelcol-crd-log.yaml -n otelcol

# OpenTelemetry-demo
helm upgrade --install otel-demo open-telemetry/opentelemetry-demo --version 0.33.1 --create-namespace -n otel-demo -f otel-demo-values.yaml


```


```sh
kubectl port-forward svc/grafana -n grafana 3000:80 &
kubectl port-forward svc/prometheus-kube-prometheus-prometheus -n prometheus 9090:9090 &
kubectl --namespace otel-demo port-forward svc/otel-demo-frontendproxy 8080:8080 &
```