let n = 0;

const generateId3 = (_: 3, label: string): string => `${label}:${++n}`;

export default generateId3;
