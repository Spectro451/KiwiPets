import { Adoptante } from "./adoptante";
import { TipoUsuario } from "./enums";
import { Notificaciones } from "./notificaciones";
import { Refugio } from "./refugio";

export type Usuario = {
  id:number;
  tipo:TipoUsuario;
  correo:string;
  contraseña:string;
  admin:boolean;
  refugio?:Refugio;
  notificaciones?:Notificaciones[];
  adoptante?:Adoptante;
}