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

export const validateCapital = (str: any) => {
  return str == str.toLowerCase();
};

export const hasNumber = (str) => {
  return /\d/.test(str);
};

export const checkForSpecialChars = (str: any) => {
  var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  if (format.test(str)) {
    return true;
  } else {
    return false;
  }
};
export const printElement = (id: any) => {
  let printHtml = document.getElementById(id).outerHTML;
  let elementPage =
    '<html><head><title></title></head><body>' + printHtml + '</body>';
  document.body.outerHTML = elementPage;
  window.print();
  document.location.reload();
};
export const concatColumnString = (colString: string) => {
  let strtext = colString;
  const myArray = strtext.split(' ');
  return myArray.join('');
};
export const getCompletedStatus = (screen: number, obj: any) => {
  obj.map((x: any, i: any) => {
    if (i == screen - 2) {
      x.isCompleted = true;
    }
    if (i == screen - 1) {
      x.isCompleted = false;
    }
    return x.isCompleted;
  });
};
