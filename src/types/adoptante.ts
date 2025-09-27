import { Adopcion } from "./adopcion";
import { Edad, EspeciePreferida, Sexo, Vivienda } from "./enums";
import { Favoritos } from "./favoritos";
import { Usuario } from "./usuario";

export type Adoptante ={
  id:number;
  rut:string;
  nombre:string;
  edad:number;
  telefono:string;
  direccion:string;
  experiencia_mascotas:string;
  cantidad_mascotas:number;
  especie_preferida:EspeciePreferida;
  tipo_vivienda:Vivienda;
  sexo:Sexo;
  edad_buscada:Edad;
  motivo_adopcion:string;
  usuario:Usuario;
  adopciones?:Adopcion[];
  favoritos?:Favoritos[];
}