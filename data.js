export let MAP = null;

export async function loadMap() {
  const res = await fetch('./mapa.json');
  MAP = await res.json();
  return MAP;
}