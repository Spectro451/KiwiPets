import { Usuario } from "./usuario";

export type Notificaciones = {
  id:number;
  usuario:Usuario;
  mensaje:string;
  leido:boolean;
  fecha:Date;
}