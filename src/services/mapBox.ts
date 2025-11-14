export interface Direccion {
  comuna: string;
  ciudad?: string;
  latitud: number;
  longitud: number;
}

export const buscarDirecciones = async (query: string): Promise<Direccion[]> => {
  if (!query || query.trim().length < 3) return [];

  try {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=pk.eyJ1Ijoic3BlY3RybzQ1MSIsImEiOiJjbWh1dmQ5OTQwNDFwMmpvaHZ2Y200MDgyIn0.XGQ4VUSS_6oriYo60LOzOw&autocomplete=true&country=CL&language=es`
    );
    const data = await res.json();

    const filtrados = (data.features || []).filter(
      (item: any) =>
        item.place_type.includes("place") || item.place_type.includes("locality")
    );

    const direcciones: Direccion[] = filtrados
      .map((item: any) => {
        const partes = item.place_name.split(",").map((p: string) => p.trim());
        return {
          comuna: partes[0],
          ciudad: partes[1] || "",
          latitud: item.center[1],
          longitud: item.center[0],
        };
      })
      // Tipamos `d` y usamos ?? para ciudad
      .filter((d: Direccion) => (d.ciudad ?? "").toLowerCase() !== d.comuna.toLowerCase());

    // Eliminar duplicados exactos
    const únicas: Direccion[] = [];
    const seen = new Set<string>();
    for (const d of direcciones) {
      const key = `${d.comuna.toLowerCase()}|${(d.ciudad ?? "").toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        únicas.push(d);
      }
    }

    return únicas;
  } catch (error) {
    console.error("Error al buscar direcciones en Mapbox:", error);
    return [];
  }
};
