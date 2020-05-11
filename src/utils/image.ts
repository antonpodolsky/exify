import { getHistogram } from './histogram';

export const fetchlBlob = (src: string) => {
  return fetch(src, { mode: 'no-cors' }).then(response => response.blob());
};

export const fetchHistogram = (src: string) => {
  return fetchlBlob(src).then(blob => {
    const image = new Image();
    image.src = URL.createObjectURL(blob);

    return new Promise(
      resolve =>
        (image.onload = () => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          const { width, height } = image;

          canvas.width = width;
          canvas.height = height;
          context.drawImage(image, 0, 0);

          const res = context.getImageData(0, 0, width, height);

          resolve(res ? getHistogram(res.data) : []);
        })
    );
  });
};
