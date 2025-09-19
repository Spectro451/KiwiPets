import { Adoptante } from "./adoptante";
import { EstadoAdopcion } from "./enums";
import { Mascota } from "./mascota";

export type Adopcion = {
  id:number;
  adoptante:Adoptante;
  mascota:Mascota;
  fecha_solicitud:Date;
  estado:EstadoAdopcion;
}