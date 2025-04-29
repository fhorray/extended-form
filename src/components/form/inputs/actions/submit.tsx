import { useFormContext } from '../../context';

export const SubmitButton = ({ label }: { label: string }) => {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => <button disabled={isSubmitting}>{label}</button>}
    </form.Subscribe>
  );
};
