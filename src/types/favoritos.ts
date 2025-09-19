import { Adoptante } from "./adoptante";
import { Mascota } from "./mascota";

export type Favoritos = {
  id:number;
  adoptante:Adoptante;
  mascota:Mascota;
}