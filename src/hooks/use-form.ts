import { useForm, UseFormProps, FieldValues, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodSchema, ZodAny } from "zod";

export function useAppForm<T extends FieldValues>(
  schema: ZodSchema<T>,
  options?: Omit<UseFormProps<T>, "resolver">
) {
  return useForm<T>({
    resolver: zodResolver(schema as any),
    ...options,
  });
}

export function getFieldError<T extends FieldValues>(
  errors: FieldErrors<T>,
  name: keyof T
): string | undefined {
  const error = errors[name];
  if (error && "message" in error) {
    return error.message as string;
  }
  return undefined;
}