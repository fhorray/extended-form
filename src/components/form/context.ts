import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
import { SubmitButton } from "./inputs/actions/submit"
import { lazy } from "react";


const InputField = lazy(() => import('@/components/form/inputs/text/text-input'));
const EmailField = lazy(() => import('@/components/form/inputs/text/email-input'));
const PasswordField = lazy(() => import('@/components/form/inputs/text/password-input'));
const UrlField = lazy(() => import('@/components/form/inputs/text/url-input'));
const PhoneField = lazy(() => import('@/components/form/inputs/text/phone-input'));
const SearchField = lazy(() => import('@/components/form/inputs/text/search-input'));
const UsernameField = lazy(() => import('@/components/form/inputs/text/username-input'));

// ADVANCED TEXT
const TextAreaField = lazy(() => import('@/components/form/inputs/advanced-text/textarea-input'));
const RichTextField = lazy(() => import('@/components/form/inputs/advanced-text/rich-text-editor-field'));

// NUMERIC INPUTS
const NumericField = lazy(() => import('@/components/form/inputs/numeric/number-input'));
const WeighthField = lazy(() => import('@/components/form/inputs/numeric/weight-input'));
const PercentageField = lazy(() => import('@/components/form/inputs/numeric/percentage-input'));
const CurrencyField = lazy(() => import('@/components/form/inputs/numeric/currency-input'));
const NumericSliderField = lazy(() => import('@/components/form/inputs/numeric/numeric-slider-input'));

// const TextAreaField = lazy(
//   () => import('@/components/form/inputs/textarea-field'),
// );
// const SelectField = lazy(() => import('@/components/form/inputs/select-field'));
// const TextEditorField = lazy(
//   () => import('@/components/form/inputs/text-editor-field'),
// );
// const FileSelectorField = lazy(
//   () => import('@/components/form/inputs/file-selector-field'),
// );
// const ColorPickerField = lazy(
//   () => import('@/components/form/inputs/color-picker-field'),
// );
// const SwitcherField = lazy(
//   () => import('@/components/form/inputs/switcher-field'),
// );

export const { fieldContext, useFieldContext, formContext, useFormContext } = createFormHookContexts()


export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    InputField,
    EmailField,
    PasswordField,
    UrlField,
    PhoneField,
    SearchField,
    UsernameField,

    TextAreaField,
    RichTextField,

    NumericField,
    WeighthField,
    CurrencyField,
    PercentageField,
    NumericSliderField
  },
  formComponents: {
    SubmitButton
  }
})