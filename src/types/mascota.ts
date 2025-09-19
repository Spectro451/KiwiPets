import { Adopcion } from "./adopcion";
import {Especie, Estado, Genero, Tamaño} from "./enums";
import { Favoritos } from "./favoritos";
import { Historial } from "./historial";
import { Refugio } from "./refugio";
import { Vacunas } from "./vacunas";

export type Mascota = {
  id_mascota: number;
  nombre:string;
  raza: string;
  edad: number;
  tamaño: Tamaño;
  especie: Especie;
  genero: Genero;
  vacunado: boolean;
  esterilizado:boolean;
  posee_descendencia: boolean;
  veces_adoptado: number;
  fecha_ingreso: Date;
  discapacidad:boolean;
  descripcion:string;
  personalidad:string;
  foto?:string;
  requisito_adopcion:string;
  estado_adopcion:Estado;
  refugio:Refugio;
  vacunas?:Vacunas[];
  historialClinico?:Historial[];
  adopciones?:Adopcion[];
  favoritos?:Favoritos[];
}