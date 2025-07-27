import { CheckCircle, XCircle } from "lucide-react";
import { z } from "zod";

interface PasswordValidationProps {
  password: string;
}

const passwordValidations = [
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

export function PasswordValidation({ password }: PasswordValidationProps) {
  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      {passwordValidations.map(({ id, label, validate }) => {
        const isValid = validate(password);
        return (
          <div key={id} className="flex items-center text-sm">
            {isValid ? (
              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
            ) : (
              <XCircle className="w-4 h-4 mr-2 text-red-400" />
            )}
            <span className={isValid ? "text-green-600" : "text-red-400"}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
