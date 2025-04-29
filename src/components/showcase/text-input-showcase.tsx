import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@tanstack/react-form';
import {
  AtSignIcon,
  Link2Icon,
  LockIcon,
  PhoneCallIcon,
  SearchIcon,
  User2Icon,
} from 'lucide-react';
import { useAppForm } from '../form/context';
import { ValueRenderer } from '../form/value-renderer';
import { validateEmail } from '../form/inputs/text/email-input';
import { validateUrl } from '../form/inputs/text/url-input';
import { validateUsername } from '../form/inputs/text/username-input';

export default function TextInputsShowcase() {
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

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Text Input</CardTitle>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="text-input"
              children={(field) => (
                <field.InputField
                  id="text-input"
                  label="Text Input Field"
                  icon={User2Icon}
                  description="Tell us your name"
                  required
                />
              )}
            />

            <ValueRenderer value={store['text-input']} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Input</CardTitle>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="email-input"
              children={(field) => (
                <field.EmailField
                  id="email-input"
                  label="Email Input Field"
                  icon={AtSignIcon}
                  description="Tell us your best e-mail"
                  required
                />
              )}
            />

            <ValueRenderer value={store['email-input']} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Password Input</CardTitle>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="password-input"
              children={(field) => (
                <field.PasswordField
                  id="password-input"
                  label="Password Input Field"
                  icon={LockIcon}
                  description="Set a password"
                  showRequirements
                  required
                />
              )}
            />

            <ValueRenderer value={store['password-input']} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>URL Input</CardTitle>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="url-input"
              children={(field) => (
                <field.UrlField
                  id="url-input"
                  label="Url Input Field"
                  icon={Link2Icon}
                  description="Set a profile URI"
                  required
                />
              )}
            />

            <ValueRenderer value={store['url-input']} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Phone Input</CardTitle>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="phone-input"
              children={(field) => (
                <field.PhoneField
                  id="phone-input"
                  label="Phone Input Field"
                  description="Tell us your best phone"
                  required
                  country="BR"
                />
              )}
            />

            <ValueRenderer value={store['phone-input']} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Search Input</CardTitle>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="search-input"
              children={(field) => (
                <field.SearchField
                  id="search-input"
                  label="Search Input Field"
                  description="Search something"
                  required
                  onSearch={(v) => window.alert(v)}
                />
              )}
            />

            <ValueRenderer value={store['search-input']} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Username Input</CardTitle>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="username-input"
              children={(field) => (
                <field.UsernameField
                  id="username-input"
                  label="Username Input Field"
                  description="Search something"
                  icon={User2Icon}
                  required
                />
              )}
            />

            <ValueRenderer value={store['username-input']} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
