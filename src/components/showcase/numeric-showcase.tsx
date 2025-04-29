import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@tanstack/react-form';
import { useAppForm } from '../form/context';
import { validateEmail } from '../form/inputs/text/email-input';
import { validateUrl } from '../form/inputs/text/url-input';
import { validateUsername } from '../form/inputs/text/username-input';
import { ValueRenderer } from '../form/value-renderer';

export default function NumericInputsShowcase() {
  const form = useAppForm({
    defaultValues: {} as any,
    validators: {
      onChangeAsyncDebounceMs: 500,
      onChange: ({ value }) => {
        console.log(value);
        // validate email
        if (value['email-input'] && !validateEmail(value['email-input'])) {
          return {
            form: { ...value },
            fields: {
              'email-input': 'Invalid e-mail!',
            },
          };
        }

        // validate URL
        if (value['url-input'] && !validateUrl(value['url-input'])) {
          return {
            form: { ...value },
            fields: {
              'url-input': 'Invalid Url!',
            },
          };
        }

        // validade username
        if (
          value['username-input'] &&
          validateUsername(value['username-input'])
        ) {
          return {
            form: { ...value },
            fields: {
              'username-input': 'Invalid Username!',
            },
          };
        }
      },
    },
    // listeners: {
    //   onChangeDebounceMs: 500,
    //   onChange: ({ fieldApi }) => {
    //     if (!validateEmail(fieldApi.state.value)) {
    //       console.log('NOT EMAIL');
    //       return;
    //     }

    //     console.log('IS EMAIL');
    //     return fieldApi.state.value;
    //   },
    // },
    onSubmit: ({ value }) => {
      console.log(value);
    },
  });

  const store = useStore(form.store, (state) => state.values);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Numeric Inputs</h2>
        <p className="text-muted-foreground">
          Components for collecting and displaying various types of numeric
          data.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Numeric Input</CardTitle>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="numeric-input-field"
              children={(field) => (
                <field.NumericField
                  id="numeric-input-field"
                  label="Number Input Field"
                  description="Tell us your name"
                  required
                />
              )}
            />

            <ValueRenderer value={store['numeric-input-field']} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weighth Input</CardTitle>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="weight-input-field"
              children={(field) => (
                <field.WeighthField
                  id="weight-input-field"
                  label="Number Input Field"
                  description="Tell us your name"
                  required
                />
              )}
            />

            <ValueRenderer value={store['weight-input-field']} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Percentage Input</CardTitle>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="weight-input-field"
              children={(field) => (
                <field.PercentageField
                  id="weight-input-field"
                  label="Number Input Field"
                  description="Tell us your name"
                  required
                />
              )}
            />

            <ValueRenderer value={store['weight-input-field']} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Currency Input</CardTitle>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="currency-input-field"
              children={(field) => (
                <field.CurrencyField
                  id="currency-input-field"
                  label="Number Input Field"
                  description="Tell us your name"
                  showCurrencySelector
                  required
                />
              )}
            />

            <ValueRenderer value={store['currency-input-field']} />
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Numeric Slider Input</CardTitle>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="numeric-slider-input-field"
              children={(field) => (
                <field.NumericSliderField
                  id="numeric-slider-input-field"
                  label="Number Input Field"
                  description="Tell us your name"
                  required
                />
              )}
            />

            <ValueRenderer value={store['currency-input-field']} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
