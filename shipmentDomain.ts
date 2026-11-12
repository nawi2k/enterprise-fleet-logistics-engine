// Tipado estricto para los estados posibles del envío (Máquina de Estados Finita)
export type ShipmentStatus = 'PENDING' | 'DISPATCHED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';

export interface Vehicle {
  id: string;
  plate: string;
  maxWeightKg: number;
  maxVolumeM3: number;
  isAvailable: boolean;
}

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  isActive: boolean;
}

export interface Shipment {
  id: string;
  trackingCode: string;
  destination: string;
  weightKg: number;
  volumeM3: number;
  status: ShipmentStatus;
  assignedVehicleId?: string;
}

// Validador de la Máquina de Estados (FSM) para garantizar transiciones seguras de negocio
export class ShipmentStateMachine {
  // Mapa estricto de transiciones permitidas
  private static validTransitions: Record<ShipmentStatus, ShipmentStatus[]> = {
    PENDING: ['DISPATCHED', 'CANCELLED'],
    DISPATCHED: ['IN_TRANSIT', 'CANCELLED'],
    IN_TRANSIT: ['DELIVERED'],
    DELIVERED: [], // Estado terminal
    CANCELLED: []  // Estado terminal
  };

  public static canTransition(current: ShipmentStatus, next: ShipmentStatus): boolean {
    return this.validTransitions[current]?.includes(next) ?? false;
  }

  public static transition(shipment: Shipment, newStatus: ShipmentStatus): void {
    if (!this.canTransition(shipment.status, newStatus)) {
      throw new Error(
        `Error de Dominio: Transición de estado inválida para el paquete '${shipment.trackingCode}'. ` +
        `No se puede pasar de '${shipment.status}' a '${newStatus}'.`
      );
    }
    shipment.status = newStatus;
  }
}