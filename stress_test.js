import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter } from 'k6/metrics';

// 1. Configuración de la Carga Extrema (2000 usuarios virtuales durante 3 minutos)
export let options = {
  // El tiempo de la prueba ahora se define completamente en las etapas.
  vus: 2000, 
  // Configuramos etapas para simular una carga de rampa rápida
  stages: [
    { duration: '30s', target: 2000 }, // Rampa hasta 2000 usuarios en 30s
    { duration: '2m', target: 2000 },  // Mantener la carga durante 2 minutos
    { duration: '30s', target: 0 },   // Rampa de bajada
  ],
  thresholds: {
    // Si la tasa de fallos HTTP supera el 5%, la prueba fallará.
    'http_req_failed': ['rate<0.05'], 
  },
};

// 2. Definición del cuerpo de la solicitud POST
// Hemos actualizado la BASE_URL para usar el NodePort directo de Minikube.
const BASE_URL = 'http://127.0.0.1:58488';

const payload = JSON.stringify({
    // Payload optimizado para un POST rápido
    idUsuario: 'test-user-k6',
    nombreCurso: 'Load Test K8s',
    fechaHora: new Date().toISOString(),
    duracionMinutos: 60,
});

const params = {
    headers: {
        'Content-Type': 'application/json',
        // Token JWT de prueba (si es necesario por el microservicio)
        'Authorization': 'Bearer YOUR_MOCK_JWT_TOKEN' 
    },
};

// 3. Flujo principal de la prueba
export default function () {
    const res = http.post(BASE_URL, payload, params);

    // Esperar un breve período antes de la próxima solicitud
    sleep(0.1); 
}