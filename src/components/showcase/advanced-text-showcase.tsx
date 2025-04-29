import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@tanstack/react-form';
import { useAppForm } from '../form/context';
import { validateEmail } from '../form/inputs/text/email-input';
import { validateUrl } from '../form/inputs/text/url-input';
import { validateUsername } from '../form/inputs/text/username-input';
import { ValueRenderer } from '../form/value-renderer';

import content from '@/components/form/inputs/advanced-text/rich-text-editor-field/content.json';

export default function AdvancedTextShowcase() {
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
        <h2 className="text-2xl font-bold tracking-tight">Text Inputs</h2>
        <p className="text-muted-foreground">
          Basic text input components for collecting various types of text data.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Basic Textarea</CardTitle>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="rich-text-input"
              children={(field) => (
                <field.TextAreaField
                  id="rich-text-input"
                  label="Text Input Field"
                  description="Tell us your name"
                  rows={910}
                  maxLength={40}
                  required
                />
              )}
            />

            <ValueRenderer value={store['rich-text-input']} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rich Text Editor</CardTitle>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="text-input"
              children={(field) => (
                <field.RichTextField
                  id="text-input"
                  label="Text Input Field"
                  content={content}
                  required
                />
              )}
            />

            <ValueRenderer value={store['text-input']} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
