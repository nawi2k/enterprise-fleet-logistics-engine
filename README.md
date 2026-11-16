# 🚚 Enterprise Fleet & Logistics Engine (TypeScript)

Backend modular de alta ingeniería desarrollado en TypeScript, diseñado para simular la gestión de flotas, la asignación inteligente de cargas bajo restricciones físicas y el procesamiento asíncrono de eventos en una empresa de logística.

---

## 🏛️ Arquitectura y Principios de Diseño

* **Máquina de Estados Finita (FSM):** Implementación de reglas estrictas de dominio para blindar las transiciones de estado de los envíos (`PENDING` -> `DISPATCHED` -> `IN_TRANSIT` -> `DELIVERED`), previniendo inconsistencias de negocio.
* **Motor de Asignación con Restricciones Físicas:** Validación simultánea de peso (kg) y volumen ($m^3$) contra la capacidad máxima de la flota vehicular antes de concretar cualquier despacho.
* **Arquitectura Orientada a Eventos (Observer Pattern / Event Bus):** Desacoplamiento de responsabilidades mediante un Bus de Eventos interno para notificaciones asíncronas y auditoría de cambios de estado.
* **Tipado Estricto Avanzado:** Uso de TypeScript avanzado con mapas de tipos inmutables (`Record`), modificadores de acceso y diseño orientado a objetos puro.

---

## 🛠️ Tecnologías Utilizadas

* **TypeScript** (Programación orientada a objetos y tipado estricto)
* **Node.js** (Entorno de ejecución)
* **Git & GitHub** (Control de versiones profesional)

---

## 📂 Estructura del Proyecto

```text
enterprise-fleet-logistics-engine/
│
├── shipmentDomain.ts    # Entidades de dominio y Máquina de Estados Finita (FSM)
├── logisticsService.ts  # Repositorio de flota/envíos y motor de asignación física
├── eventBus.ts          # Sistema de eventos asíncronos (Observer Pattern)
└── main.ts              # Script de pruebas integrales y simulación de flujos