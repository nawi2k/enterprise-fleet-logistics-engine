import { ShipmentStateMachine } from './shipmentDomain';
import { logisticsRepo, LogisticsService } from './logisticsService';
import './eventBus'; // Importamos el bus de eventos y sus suscriptores

console.log("=== INICIO DE PRUEBAS: ENTERPRISE FLEET LOGISTICS ENGINE ===");

// 1. Listar estado inicial de la flota y los envíos
console.log("\n1. Estado inicial de Vehículos:");
console.log(logisticsRepo.getAllVehicles());

console.log("\n2. Estado inicial de Envíos:");
console.log(logisticsRepo.getAllShipments());

// 2. Probar asignación exitosa de un envío dentro de los límites de peso y volumen
try {
  console.log("\n3. Intentando asignar el envío S-101 (Peso: 250kg, Volumen: 2m³) al vehículo V-01 (Capacidad: 1500kg, 12m³)...");
  
  // Ejecutamos la asignación (esto transita el estado a DISPATCHED y emite el evento)
  LogisticsService.assignShipmentToVehicle('S-101', 'V-01');
  
  const shipment = logisticsRepo.getShipmentById('S-101');
  console.log("✅ ¡Asignación y despacho exitosos!");
  console.log("Estado actual del envío S-101:", shipment);
} catch (error: any) {
  console.error("❌ Error en la asignación:", error.message);
}

// 3. Probar restricción física de negocio (Superar el peso máximo del vehículo)
try {
  console.log("\n4. Intentando asignar el envío S-102 (Peso: 1200kg) al vehículo V-02 (Capacidad máxima de peso: 500kg)...");
  LogisticsService.assignShipmentToVehicle('S-102', 'V-02');
} catch (error: any) {
  console.error("⚠️ Excepción de restricción física capturada correctamente:", error.message);
}

// 4. Probar la Máquina de Estados Finita (FSM) de forma aislada
console.log("\n5. Probando la Máquina de Estados (FSM) con transiciones inválidas...");
const testShipment = logisticsRepo.getShipmentById('S-102')!;
console.log(`Estado actual de S-102: ${testShipment.status}`);

try {
  console.log("Intentando pasar de PENDING directamente a DELIVERED (Salto de estado prohibido)...");
  ShipmentStateMachine.transition(testShipment, 'DELIVERED');
} catch (error: any) {
  console.error("🛡️ FSM Bloqueó la transición inválida correctamente:", error.message);
}

console.log("\n=== FIN DE LAS PRUEBAS INTEGRALES DE LOGÍSTICA ===");