export function iconUrl(file: string) {
  return `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${file}`;
}

export const cleanupImgCache = () => {
  Object.keys(localStorage)
    .filter((key) => key.startsWith('imgCache_'))
    .forEach((key) => {
      localStorage.removeItem(key);
    });
};
