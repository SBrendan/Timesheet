export const generateID = (name: string, date: Date): string => {
  return name + date.getTime();
};
