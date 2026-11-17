# Proyek Kedua — Deploy Aplikasi Karsa Jobs dengan Kubernetes

| Lokasi | Isi |
|---|---|
| branch `karsajobs` | backend + `build_push_image_karsajobs.sh` + CI (`.github/workflows/ci-karsajobs.yml`) |
| branch `karsajobs-ui` | frontend + `build_push_image_karsajobs_ui.sh` + CI (`.github/workflows/ci-karsajobs-ui.yml`) |
| `kubernetes/` | manifest backend, frontend, dan MongoDB |
| `monitoring/` | Helm values Prometheus & Grafana (namespace `monitoring`) + dashboard Grafana |
| `link.txt` | tautan image di GitHub Packages |
| `monitoring.txt` | output `kubectl get all -n monitoring` |
| `screenshots/` | Grafana dashboard, CI sukses, dan aplikasi yang berjalan |

## Deploy (minikube)
```bash
kubectl apply -f kubernetes/mongodb/
kubectl apply -f kubernetes/backend/
kubectl apply -f kubernetes/frontend/
# Frontend: http://<minikube ip>:30000  ·  Backend: http://<minikube ip>:30080
```

## Monitoring
```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm install prometheus prometheus-community/prometheus -n monitoring --create-namespace -f monitoring/prometheus-values.yml
helm install grafana grafana/grafana -n monitoring -f monitoring/grafana-values.yml \
  --set-file dashboards.default.karsajobs-monitoring.json=monitoring/dashboards/karsajobs-dashboard.json
# Grafana: http://<minikube ip>:30300  ·  Prometheus: http://<minikube ip>:30090
```
