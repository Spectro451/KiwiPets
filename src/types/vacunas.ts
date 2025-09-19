import { Mascota } from "./mascota";

export type Vacunas = {
  id:number;
  nombre:string;
  fecha_aplicacion:Date;
  proxima_dosis?:Date;
  observaciones?:string;
  mascota:Mascota;
}