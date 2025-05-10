# entrypoint.sh
#!/bin/sh
echo "Waiting for backend:8000…"
while ! nc -z backend 8000; do
  echo "  backend not reachable yet; sleeping 3s"
  sleep 3
done

echo "→ backend is up!  Starting nginx."
exec nginx -g "daemon off;"
