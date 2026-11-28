let n = 0;

// export const generateId1 = (): string => `${new Date().getTime()}:${++n}`;
export const generateId2 = (label: string): string => `${label}:${++n}`;
