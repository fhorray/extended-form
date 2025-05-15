import { lazy } from "react"
import { createFormHook, createFormHookContexts } from "@tanstack/react-form"

// TEXT
const InputField = lazy(() => import("@/components/form/fields/text/text-input"))
const EmailField = lazy(() => import("@/components/form/fields/text/email-input"))
const PasswordField = lazy(() => import("@/components/form/fields/text/password-input"))
const UrlField = lazy(() => import("@/components/form/fields/text/url-input"))
const PhoneField = lazy(() => import("@/components/form/fields/text/phone-input"))
const SearchField = lazy(() => import("@/components/form/fields/text/search-input"))
const UsernameField = lazy(() => import("@/components/form/fields/text/username-input"))

// ADVANCED TEXT
const TextAreaField = lazy(() => import("@/components/form/fields/advanced-text/textarea-input"))
const RichTextField = lazy(() => import("@/components/form/fields/advanced-text/rich-text-field"))

// NUMERIC
const NumericField = lazy(() => import("@/components/form/fields/numeric/number-input"))
const WeighthField = lazy(() => import("@/components/form/fields/numeric/weight-input"))
const PercentageField = lazy(() => import("@/components/form/fields/numeric/percentage-input"))
const CurrencyField = lazy(() => import("@/components/form/fields/numeric/currency-input"))
const NumericSliderField = lazy(() => import("@/components/form/fields/numeric/numeric-slider-input"))

// SELECTORS
const SelectField = lazy(() => import("@/components/form/fields/selectors/select-field"))

// SWITCHERS
const SwitcherField = lazy(() => import("@/components/form/fields/switcher-field"))

// MEDIA & UPLOADS
const FileUploadField = lazy(() => import("@/components/form/fields/media/file-upload"))
const ImageUploadField = lazy(() => import("@/components/form/fields/media/image-upload"))
const VideoUploadField = lazy(() => import("@/components/form/fields/media/video-upload"))
const AudioUploadField = lazy(() => import("@/components/form/fields/media/audio-upload"))
const DocumentUploadField = lazy(() => import("@/components/form/fields/media/document-upload"))
const DragDropUploadField = lazy(() => import("@/components/form/fields/media/drag-drop-upload"))
const MultipleFilesUploadField = lazy(() => import("@/components/form/fields/media/multiple-files-upload"))
const FileReorderField = lazy(() => import("@/components/form/fields/media/file-reorder"))
const WebcamCaptureField = lazy(() => import("@/components/form/fields/media/webcam-capture"))
const VoiceRecorderField = lazy(() => import("@/components/form/fields/media/voice-recorder"))

// VISUAL / UI
const ColorPickerField = lazy(() => import("@/components/form/fields/visual/color-picker"))
const GradientPickerField = lazy(() => import("@/components/form/fields/visual/gradient-picker"))
const IconPickerField = lazy(() => import("@/components/form/fields/visual/icon-picker"))
const EmojiPickerField = lazy(() => import("@/components/form/fields/visual/emoji-picker"))
const AvatarUploaderField = lazy(() => import("@/components/form/fields/visual/avatar-uploader"))
const ThemeSelectorField = lazy(() => import("@/components/form/fields/visual/theme-selector"))


// COMPLEX / STRUCTURED
const ObjectFieldComponent = lazy(() => import("@/components/form/fields/complex/object-field"))
const ArrayFieldComponent = lazy(() => import("@/components/form/fields/complex/array-field"))
const TableFieldComponent = lazy(() => import("@/components/form/fields/complex/table-field"))
const KeyValuePairEditorComponent = lazy(() => import("@/components/form/fields/complex/key-value-pair-editor"))
const JsonInputComponent = lazy(() => import("@/components/form/fields/complex/json-input"))
const DynamicFormSectionsComponent = lazy(() => import("@/components/form/fields/complex/dynamic-form-sections"))

// INTERACTIVE
const RatingInputField = lazy(() => import("@/components/form/fields/interactive/rating-input"))
const LikeDislikeField = lazy(() => import("@/components/form/fields/interactive/like-dislike"))
const ProgressBarField = lazy(() => import("@/components/form/fields/interactive/progress-bar"))
const SliderInputField = lazy(() => import("@/components/form/fields/interactive/slider-input"))
const CaptchaField = lazy(() => import("@/components/form/fields/interactive/captcha"))
const PasswordStrengthField = lazy(() => import("@/components/form/fields/interactive/password-strength"))
const AutoSuggestField = lazy(() => import("@/components/form/fields/interactive/auto-suggest"))
const WizardFormField = lazy(() => import("@/components/form/fields/interactive/wizard-form"))

// SYSTEM
const HiddenInputField = lazy(() => import("@/components/form/fields/system/hidden-input"))
const SubmitButtonField = lazy(() => import("@/components/form/fields/system/submit-button"))
const ResetButtonField = lazy(() => import("@/components/form/fields/system/reset-button"))
const ActionButtonField = lazy(() => import("@/components/form/fields/system/action-button"))
const PreviewButtonField = lazy(() => import("@/components/form/fields/system/preview-button"))
const SaveDraftButtonField = lazy(() => import("@/components/form/fields/system/save-draft-button"))

// SPECIALIZED
const OtpInputField = lazy(() => import("@/components/form/fields/specialized/otp-input"))
const CreditCardInputField = lazy(() => import("@/components/form/fields/specialized/credit-card-input"))
const SsnInputField = lazy(() => import("@/components/form/fields/specialized/ssn-input"))
const CustomValidatorInputField = lazy(() => import("@/components/form/fields/specialized/custom-validator-input"))

// Criar os contextos
export const {
  fieldContext,
  useFieldContext,
  formContext,
  useFormContext,
} = createFormHookContexts()

// Criar o hook e registrar os componentes
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
    PercentageField,
    CurrencyField,
    NumericSliderField,

    SelectField,
    SwitcherField,

    FileUploadField,
    ImageUploadField,
    VideoUploadField,
    AudioUploadField,
    DocumentUploadField,
    DragDropUploadField,
    MultipleFilesUploadField,
    FileReorderField,
    WebcamCaptureField,
    VoiceRecorderField,

    ColorPickerField,
    GradientPickerField,
    IconPickerField,
    EmojiPickerField,
    AvatarUploaderField,
    ThemeSelectorField,

    ObjectFieldComponent,
    ArrayFieldComponent,
    TableFieldComponent,
    KeyValuePairEditorComponent,
    JsonInputComponent,
    DynamicFormSectionsComponent,

    RatingInputField,
    LikeDislikeField,
    ProgressBarField,
    SliderInputField,
    CaptchaField,
    PasswordStrengthField,
    AutoSuggestField,
    WizardFormField,

    HiddenInputField,
    SubmitButtonField,
    ResetButtonField,
    ActionButtonField,
    PreviewButtonField,
    SaveDraftButtonField,

    OtpInputField,
    CreditCardInputField,
    SsnInputField,
    CustomValidatorInputField,
  },
  formComponents: {
    SubmitButton: SubmitButtonField,
  },
})
