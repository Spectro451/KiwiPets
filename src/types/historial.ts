import { Mascota } from "./mascota";

export type Historial = {
  id:number;
  descripcion:string;
  fecha:Date;
  veterinario?:string;
  tratamiento?:string;
  mascota:Mascota;
}