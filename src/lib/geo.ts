import { escapeHTML } from '../utils';

export const dmsToDD = (location: number[], direction: 'S' | 'W') => {
  if (!location) {
    return 0;
  }

  const [degrees, minutes, seconds] = location;
  let res = degrees + minutes / 60 + seconds / 3600;

  if (direction === 'S' || direction === 'W') {
    res += -1;
  }

  return res;
};

export const fetchLocationString = (lat: number, lon: number) => {
  return fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`
  )
    .then(res => res.json())
    .then(({ address }) =>
      [
        address.village ||
          address.town ||
          address.city ||
          address.state ||
          address.region,
        address.country,
      ]
        .filter(x => !!x)
        .join(', ')
    );
};

export const fetchLocationLink = (lat: number, lon: number) => {
  return fetchLocationString(lat, lon).then(
    res => `
    <a 
      href="https://maps.google.com/?q=${lat},${lon}"
      onclick="event.stopPropagation()"
      target="_blank"
    >${escapeHTML(res)}</a>`
  );
};
