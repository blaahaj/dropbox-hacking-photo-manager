let n = 0;

const generateId = (label: string): string => `${label ?? new Date().getTime()}:${++n}`;

export default generateId;
