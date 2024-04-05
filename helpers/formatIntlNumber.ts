export const formatIntlNumber = (number: number) => {
  return new Intl.NumberFormat("en-US").format(number);
};

export default formatIntlNumber;
