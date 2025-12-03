// stress_test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 2000,
  duration: '45s', // Aumentado a 45s para asegurar tiempo suficiente para el escalado
  thresholds: {
    'http_req_failed': ['rate<0.05'], 
  },
};

export default function () {
  const url = 'http://localhost:8888/tutorias'; // <-- URL del port-forward
  const payload = JSON.stringify({
    estudianteId: 'e12345',
    materia: 'Arquitectura de Software',
    descripcion: 'Solicitud de tutoría masiva para escalar.',
  });
  const params = { headers: { 'Content-Type': 'application/json' } };
  http.post(url, payload, params);
  sleep(0.1); 
}