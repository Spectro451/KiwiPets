import { Mascota } from "./mascota";
import { Usuario } from "./usuario";

export type Refugio ={
  id:number;
  nombre:string;
  direccion:string;
  telefono:string;
  email:string;
  validado:boolean;
  usuario:Usuario;
  mascotas?:Mascota[];
}