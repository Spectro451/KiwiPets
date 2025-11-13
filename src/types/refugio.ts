import { Mascota } from "./mascota";
import { Usuario } from "./usuario";

export type Refugio ={
  id:number;
  nombre:string;
  direccion:string;
  comuna?: string;
  latitud?: number;
  longitud?: number;
  telefono:string;
  validado:boolean;
  usuario:Usuario;
  mascotas?:Mascota[];
}