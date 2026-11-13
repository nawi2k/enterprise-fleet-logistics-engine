import { Shipment, Vehicle, Driver, ShipmentStateMachine } from './shipmentDomain';

// Capa de Datos y Repositorios simulados para Flota y Envíos
class LogisticsRepository {
  private vehicles: Vehicle[] = [
    { id: 'V-01', plate: 'AB-123-CD', maxWeightKg: 1500, maxVolumeM3: 12, isAvailable: true },
    { id: 'V-02', plate: 'EF-456-GH', maxWeightKg: 500, maxVolumeM3: 4, isAvailable: true },
    { id: 'V-03', plate: 'IJ-789-KL', maxWeightKg: 3000, maxVolumeM3: 25, isAvailable: false }, // Ocupado/Inactivo
  ];

  private shipments: Shipment[] = [
    { id: 'S-101', trackingCode: 'TRK-9901-BA', destination: 'Palermo, CABA', weightKg: 250, volumeM3: 2, status: 'PENDING' },
    { id: 'S-102', trackingCode: 'TRK-9902-CB', destination: 'Rosario, Santa Fe', weightKg: 1200, volumeM3: 10, status: 'PENDING' },
  ];

  public getAllVehicles(): Vehicle[] {
    return this.vehicles;
  }

  public getVehicleById(id: string): Vehicle | undefined {
    return this.vehicles.find(v => v.id === id);
  }

  public getAllShipments(): Shipment[] {
    return this.shipments;
  }

  public getShipmentById(id: string): Shipment | undefined {
    return this.shipments.find(s => s.id === id);
  }

  public addShipment(shipment: Shipment): void {
    this.shipments.push(shipment);
  }
}

export const logisticsRepo = new LogisticsRepository();

// Capa de Negocio / Servicio de Asignación Inteligente de Envíos
export class LogisticsService {
  
  // Algoritmo de asignación de vehículo basado en restricciones físicas (Peso y Volumen)
  public static assignShipmentToVehicle(shipmentId: string, vehicleId: string): void {
    const shipment = logisticsRepo.getShipmentById(shipmentId);
    const vehicle = logisticsRepo.getVehicleById(vehicleId);

    if (!shipment) {
      throw new Error(`Error de Negocio: El envío con ID '${shipmentId}' no existe en el sistema.`);
    }

    if (!vehicle) {
      throw new Error(`Error de Negocio: El vehículo con ID '${vehicleId}' no existe en la flota.`);
    }

    // 1. Validación de disponibilidad del vehículo
    if (!vehicle.isAvailable) {
      throw new Error(`Asignación rechazada: El vehículo con patente '${vehicle.plate}' no se encuentra disponible actualmente.`);
    }

    // 2. Validación de restricciones físicas de Carga (Peso máximo)
    if (shipment.weightKg > vehicle.maxWeightKg) {
      throw new Error(
        `Restricción de Peso superada: El paquete pesa ${shipment.weightKg} kg, ` +
        `pero el vehículo '${vehicle.plate}' soporta un máximo de ${vehicle.maxWeightKg} kg.`
      );
    }

    // 3. Validación de restricciones físicas de Volumen (Espacio máximo)
    if (shipment.volumeM3 > vehicle.maxVolumeM3) {
      throw new Error(
        `Restricción de Volumen superada: El paquete ocupa ${shipment.volumeM3} m³, ` +
        `pero el vehículo '${vehicle.plate}' tiene una capacidad máxima de ${vehicle.maxVolumeM3} m³.`
      );
    }

    // 4. Si pasa todas las reglas, vinculamos y actualizamos estado usando la FSM
    ShipmentStateMachine.transition(shipment, 'DISPATCHED');
    shipment.assignedVehicleId = vehicle.id;
    
    // Marcamos el vehículo como ocupado temporalmente
    vehicle.isAvailable = false;
  }
}