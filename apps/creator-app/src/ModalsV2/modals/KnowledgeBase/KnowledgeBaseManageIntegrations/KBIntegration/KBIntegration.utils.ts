export const formatFromNow = (date: string) => {
  let formattedDate = date.replace(' a few seconds', 's');
  formattedDate = formattedDate.replace(' a minute', 'm');
  formattedDate = formattedDate.replace(' minutes', 'm');
  formattedDate = formattedDate.replace(' an hour', 'h');
  formattedDate = formattedDate.replace(' hours', 'h');
  formattedDate = formattedDate.replace(' a day', 'd');
  formattedDate = formattedDate.replace(' days', 'd');
  formattedDate = formattedDate.replace(' a month', 'mo');
  formattedDate = formattedDate.replace(' months', 'mo');
  formattedDate = formattedDate.replace(' a year', 'y');
  formattedDate = formattedDate.replace(' years', 'y');
  return formattedDate;
};
