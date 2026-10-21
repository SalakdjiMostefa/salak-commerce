// Détection automatique de l'IP pour smartphone & desktop
const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

export const environment = {
  production: false,
  // Si vous accédez depuis un smartphone via votre IP locale (ex: 192.168.x.x:4200),
  // l'application appellera automatiquement le backend Spring Boot sur cette même IP:8080 !
  apiUrl: `http://${host}:8080/api`
};
