import { CheckCircle, XCircle } from "lucide-react";
import { passwordValidations } from "../utils/schema";

interface PasswordValidationProps {
  password: string;
}

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
