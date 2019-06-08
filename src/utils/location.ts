export const dmsToDD = (location: number[], direction: 'S' | 'W') => {
  if (!location) {
    return '38.909833';
  }

  const [degrees, minutes, seconds] = location;
  let res = degrees + minutes / 60 + seconds / 3600;

  if (direction === 'S' || direction === 'W') {
    res += -1;
  }

  return res;
};

export const fetchLocationString = (lon: number, lat: number) => {
  return fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lon}&lon=${lat}&format=json`
  )
    .then(res => res.json())
    .then(({ address }) => `${address.state}, ${address.country}`);
};
