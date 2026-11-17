# Proyek Akhir — Implementasi Asynchronous Communication pada E-Commerce App

| Lokasi | Isi |
|---|---|
| branch `order-service` | source code + `Dockerfile` + `build_push_image.sh` (menerima `POST /order`, kirim ke RabbitMQ) |
| branch `shipping-service` | source code + `Dockerfile` + `build_push_image.sh` (konsumsi queue `order`, cetak di console) |
| `kubernetes/` | manifest Namespace, RabbitMQ, order service, shipping service, dan Istio Gateway/VirtualService |
| `link.txt` | tautan image di GitHub Packages |
| `test-result.txt` | bukti uji coba end-to-end |

## Deploy di Kubernetes (minikube) dengan Istio
```bash
# 1. Install Istio (istiod + Istio Ingress Gateway)
istioctl install --set profile=default -y

# 2. Namespace "ecommerce" (label istio-injection=enabled → sidecar Envoy otomatis)
kubectl apply -f kubernetes/namespace.yml

# 3. RabbitMQ terlebih dahulu (StatefulSet rabbitmq:3.11-management), tunggu sampai siap
kubectl apply -f kubernetes/rabbitmq/
kubectl -n ecommerce rollout status statefulset/rabbitmq

# 4. Order service dan shipping service (image dari GitHub Packages)
kubectl apply -f kubernetes/order-service/ -f kubernetes/shipping-service/

# 5. Istio Gateway + VirtualService (uri exact /order → Service order-service)
kubectl apply -f kubernetes/istio/
```

## Uji coba
```bash
INGRESS_PORT=$(kubectl -n istio-system get svc istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="http2")].nodePort}')
curl -X POST http://$(minikube ip):$INGRESS_PORT/order -H 'Content-Type: application/json' -d '{
  "order": {"book_name": "Harry Potter", "author": "J.K Rowling",
            "buyer": "Fikri Helmi Setiawan", "shipping_address": "Jl. Batik Kumeli no 50 Bandung"}}'
kubectl -n ecommerce logs deploy/shipping-service -c shipping-service
```
