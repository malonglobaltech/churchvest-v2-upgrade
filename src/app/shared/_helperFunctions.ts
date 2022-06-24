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
  if (obj1?.first_name == obj2?.first_name && obj1?.id == obj2?.id) return true;
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
export const truncateString = (str: string, num: number) => {
  if (str.length > num) {
    return str.slice(0, num) + '...';
  } else {
    return str;
  }
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
export const getDayList = () => {
  let arr = [];
  for (let i = 1; i < 32; i++) {
    arr.push(i);
  }
  return arr;
};
export const setDateQuery = (query: string) => {
  let inputedDate = new Date(query);
  let today = new Date();
  let date =
    today.getFullYear() +
    '-' +
    ('0' + (today.getMonth() + 1)).slice(-2) +
    '-' +
    ('0' + today.getDate()).slice(-2);
  if (query !== '' && query !== undefined) {
    inputedDate.setDate(inputedDate.getDate() + 1);
    date = inputedDate.toISOString().split('T')[0];
  }
  return date;
};
export const checkForBirthdayMonth = (val) => {
  const parts = val.split(/[- :]/);
  let month = parts[1];
  let day = parts[2];
  let today, bday, diff, days;
  today = new Date();
  bday = new Date(today.getFullYear(), month - 1, day);
  if (today.getTime() > bday.getTime()) {
    bday.setFullYear(bday.getFullYear() + 1);
  }
  diff = bday.getTime() - today.getTime();
  days = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
  return days;
};
export const getMonthList = () => {
  let mlist = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return mlist;
};
export const getDays = () => {
  let days = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];
  return days;
};
