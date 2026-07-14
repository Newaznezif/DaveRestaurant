"use client";

import * as React from "react";
import { UseFormReturn, FieldValues, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FormFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FormField<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  type = "text",
  required = false,
  disabled = false,
  className,
}: FormFieldProps<T>) {
  const { register, formState } = form;
  const error = formState.errors[name];

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={name}>
          {label}
          {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        {...register(name)}
        className={error ? "border-destructive" : undefined}
      />
      {error && (
        <p className="text-sm text-destructive">
          {error.message as string}
        </p>
      )}
    </div>
  );
}

interface FormSelectProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FormSelect<T extends FieldValues>({
  form,
  name,
  label,
  options,
  placeholder,
  required = false,
  disabled = false,
  className,
}: FormSelectProps<T>) {
  const { register, formState } = form;
  const error = formState.errors[name];

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={name}>
          {label}
          {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <select
        id={name}
        disabled={disabled}
        {...register(name)}
        className={cn(
          "flex h-9 w-full rounded-md border bg-background px-3 py-2 text-sm",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive"
        )}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-destructive">
          {error.message as string}
        </p>
      )}
    </div>
  );
}

interface FormTextareaProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  className?: string;
}

export function FormTextarea<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  required = false,
  disabled = false,
  rows = 3,
  className,
}: FormTextareaProps<T>) {
  const { register, formState } = form;
  const error = formState.errors[name];

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={name}>
          {label}
          {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <textarea
        id={name}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        {...register(name)}
        className={cn(
          "flex w-full rounded-md border bg-background px-3 py-2 text-sm",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive"
        )}
      />
      {error && (
        <p className="text-sm text-destructive">
          {error.message as string}
        </p>
      )}
    </div>
  );
}

interface FormSwitchProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function FormSwitch<T extends FieldValues>({
  form,
  name,
  label,
  disabled = false,
  className,
}: FormSwitchProps<T>) {
  const { register, formState } = form;
  const error = formState.errors[name];

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <input
        type="checkbox"
        id={name}
        disabled={disabled}
        {...register(name)}
        className="h-4 w-4 rounded border border-input"
      />
      {label && (
        <Label htmlFor={name} className="cursor-pointer">
          {label}
        </Label>
      )}
      {error && (
        <p className="text-sm text-destructive">
          {error.message as string}
        </p>
      )}
    </div>
  );
}