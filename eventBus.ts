// Tipos de eventos del sistema logístico
export type EventType = 'SHIPMENT_DISPATCHED' | 'SHIPMENT_STATUS_CHANGED';

export interface DomainEvent {
  type: EventType;
  payload: any;
  occurredAt: Date;
}

type EventListener = (payload: any) => void;

// Patrón Observer / Event Bus centralizado
export class EventBus {
  private static listeners: Map<EventType, EventListener[]> = new Map();

  // Suscribir un servicio/oyente a un tipo de evento
  public static subscribe(eventType: EventType, listener: EventListener): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(listener);
  }

  // Publicar / Emitir un evento hacia todos los oyentes registrados
  public static publish(eventType: EventType, payload: any): void {
    const event: DomainEvent = {
      type: eventType,
      payload,
      occurredAt: new Date(),
    };

    console.log(`\n[EVENT BUS] 📡 Emitiendo evento: [${event.type}]`, JSON.stringify(event.payload));

    const eventListeners = this.listeners.get(eventType);
    if (eventListeners) {
      eventListeners.forEach(listener => {
        try {
          listener(event.payload);
        } catch (error) {
          console.error(`[EVENT BUS ERROR] Error ejecutando listener para ${eventType}:`, error);
        }
      });
    }
  }
}

// Simulador de un Servicio de Notificaciones (Escucha eventos de forma desacoplada)
export class NotificationService {
  public static registerListeners(): void {
    EventBus.subscribe('SHIPMENT_DISPATCHED', (payload) => {
      console.log(`📧 [Notificaciones] Enviando email al cliente: Su paquete ${payload.trackingCode} ha sido asignado al vehículo ${payload.vehiclePlate} y preparado para despacho.`);
    });
  }
}

// Registramos los oyentes al iniciar
NotificationService.registerListeners();