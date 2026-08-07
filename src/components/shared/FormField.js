'use client';

/**
 * FormField.js
 *
 * Lightweight, styled replacements for HeroUI v2 Input/TextArea props
 * that are NOT supported in HeroUI v3 (onValueChange, errorMessage,
 * isInvalid, startContent, minRows).
 *
 * Drop-in for react-hook-form Controller renders.
 */

import { forwardRef } from 'react';

const baseInputClass =
  'w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-gray-900 ' +
  'placeholder-gray-400 outline-none transition-colors ' +
  'focus:ring-2 focus:ring-offset-0 ';

const validClass   = 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-blue-100';
const invalidClass = 'border-red-400 hover:border-red-500 focus:border-red-500 focus:ring-red-100';

/** ------------------------------------------------------------------ *
 *  FormInput
 *  Mirrors HeroUI v2 <Input> props:
 *    label, placeholder, type, errorMessage, isInvalid, startContent,
 *    onValueChange, value, onChange, readOnly, disabled, description,
 *    classNames (inputWrapper, label), variant, min, max, step, name
 * ------------------------------------------------------------------- */
export const FormInput = forwardRef(function FormInput(
  {
    label,
    placeholder,
    type = 'text',
    errorMessage,
    isInvalid = false,
    startContent,
    onValueChange,
    value,
    onChange,
    readOnly,
    disabled,
    description,
    classNames = {},
    variant,      // ignored – kept for API compat
    className = '',
    min,
    max,
    step,
    name,
    id,
    ...rest
  },
  ref
) {
  const inputId = id || name || label?.toLowerCase().replace(/\s+/g, '-');

  const handleChange = (e) => {
    onChange?.(e);
    onValueChange?.(e.target.value);
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className={`text-sm font-medium text-gray-700 ${classNames.label || ''}`}
        >
          {label}
        </label>
      )}

      <div className={`relative flex items-center ${classNames.inputWrapper || ''}`}>
        {startContent && (
          <span className="absolute left-3 flex items-center pointer-events-none select-none">
            {startContent}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={handleChange}
          readOnly={readOnly}
          disabled={disabled}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          className={
            baseInputClass +
            (isInvalid ? invalidClass : validClass) +
            (startContent ? ' pl-8' : '') +
            (disabled || readOnly ? ' bg-gray-50 text-gray-500 cursor-not-allowed' : '')
          }
          aria-invalid={isInvalid}
          aria-describedby={
            errorMessage ? `${inputId}-error` : description ? `${inputId}-desc` : undefined
          }
          {...rest}
        />
      </div>

      {description && !errorMessage && (
        <p id={`${inputId}-desc`} className="text-xs text-gray-500">
          {description}
        </p>
      )}
      {isInvalid && errorMessage && (
        <p id={`${inputId}-error`} className="text-xs text-red-500 font-medium">
          {errorMessage}
        </p>
      )}
    </div>
  );
});

/** ------------------------------------------------------------------ *
 *  FormTextarea
 *  Mirrors HeroUI v2 <TextArea> props:
 *    label, placeholder, errorMessage, isInvalid, onValueChange,
 *    minRows, value, onChange, description, classNames, variant
 * ------------------------------------------------------------------- */
export const FormTextarea = forwardRef(function FormTextarea(
  {
    label,
    placeholder,
    errorMessage,
    isInvalid = false,
    onValueChange,
    value,
    onChange,
    minRows = 3,
    description,
    classNames = {},
    variant,      // ignored – kept for API compat
    className = '',
    name,
    id,
    ...rest
  },
  ref
) {
  const inputId = id || name || label?.toLowerCase().replace(/\s+/g, '-');

  const handleChange = (e) => {
    onChange?.(e);
    onValueChange?.(e.target.value);
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className={`text-sm font-medium text-gray-700 ${classNames.label || ''}`}
        >
          {label}
        </label>
      )}

      <textarea
        ref={ref}
        id={inputId}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        rows={minRows}
        className={
          baseInputClass +
          (isInvalid ? invalidClass : validClass) +
          ' resize-y min-h-[80px]'
        }
        aria-invalid={isInvalid}
        aria-describedby={
          errorMessage ? `${inputId}-error` : description ? `${inputId}-desc` : undefined
        }
        {...rest}
      />

      {description && !errorMessage && (
        <p id={`${inputId}-desc`} className="text-xs text-gray-500">
          {description}
        </p>
      )}
      {isInvalid && errorMessage && (
        <p id={`${inputId}-error`} className="text-xs text-red-500 font-medium">
          {errorMessage}
        </p>
      )}
    </div>
  );
});
