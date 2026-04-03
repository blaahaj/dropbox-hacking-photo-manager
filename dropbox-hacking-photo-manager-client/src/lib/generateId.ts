let n = 0;

export default (_: 3, label: string): string => `${label}:${++n}`;
