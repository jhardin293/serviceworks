export const arrayToObject = (arr) => {

  return arr.reduce(function (acc, cur, i) {
    acc[i] = cur;
    return acc;
  }, {});
}