import z from "zod";

export const passwordValidations = [
  {
    id: "length",
    label: "At least 8 characters",
    validate: (val: string) => val.length >= 8,
  },
  {
    id: "uppercase",
    label: "One uppercase letter",
    validate: (val: string) => /[A-Z]/.test(val),
  },
  {
    id: "lowercase",
    label: "One lowercase letter",
    validate: (val: string) => /[a-z]/.test(val),
  },
  {
    id: "number",
    label: "One number",
    validate: (val: string) => /[0-9]/.test(val),
  },
  {
    id: "special",
    label: "One special character",
    validate: (val: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(val),
  },
] as const;

export const passwordSchema = z
  .string()
  .refine((val) =>
    passwordValidations.every((validation) => validation.validate(val))
  );
