import * as _types from '../shared';

export const formatEmum = (enumElement: any) => {
  let enumKeys = Object.keys(enumElement).filter((f) => !isNaN(Number(f)));
  return enumKeys.map((x) => parseInt(x));
};
export const commaFormatted = (event: any) => {
  if (event.which >= 37 && event.which <= 40) return;

  if (event.target.value) {
    event.target.value = event.target.value
      .replace(/\D/g, '')
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
};
export const numberCheck = (args: any) => {
  if (args.key === 'e' || args.key === '+' || args.key === '-') {
    return false;
  } else {
    return true;
  }
};
export const compareObjects = (obj1: any, obj2: any) => {
  if (
    obj1?.payElementName == obj2?.payElementName &&
    obj1?.payElementId == obj2?.payElementId
  )
    return true;
  else return false;
};
export const formatDate = (dt: any) => {
  return dt.split('T')[0];
};
