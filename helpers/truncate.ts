export const truncate = (str: string, maxLength: number = 10): string => {
  if (str.length <= maxLength) {
    return str;
  } else {
    return str.substring(0, maxLength) + "...";
  }
};
