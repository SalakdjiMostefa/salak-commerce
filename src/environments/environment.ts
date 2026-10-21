const isBrowser = typeof window !== 'undefined';
// Si on tourne sur localhost ou sur l'IP Wi-Fi locale
const isLocal = isBrowser && (window.location.hostname === 'localhost' || window.location.hostname.startsWith('192.168.'));

export const environment = {
  production: !isLocal,
  // En local : appel direct au port 8080
  // En ligne (Amplify) : passe par le proxy /api
  apiUrl: isLocal ? `http://${window.location.hostname}:8080/api` : '/api'
};
