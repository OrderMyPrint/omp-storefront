/** Client-side checks for forms. The API repeats every check on the server. */

export const isIndianMobile = (value: string) => /^[6-9]\d{9}$/.test(value.replace(/\s/g, ""));

export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

export const digitsOnly = (value: string, max: number) => value.replace(/\D/g, "").slice(0, max);
