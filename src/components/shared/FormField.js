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
    endContent,
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
        {endContent && (
          <span className="absolute right-3 flex items-center z-10">
            {endContent}
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
            (endContent ? ' pr-10' : '') +
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
 *  PasswordToggle
 *  Eye / eye-off button for toggling password visibility. Drop it into
 *  FormInput's `endContent` slot.
 * ------------------------------------------------------------------- */
export function PasswordToggle({ show, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="p-1 rounded-lg text-gray-400 hover:text-cf-dark transition-colors"
      aria-label={show ? 'Hide password' : 'Show password'}
      title={show ? 'Hide password' : 'Show password'}
    >
      {show ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )}
    </button>
  );
}

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
