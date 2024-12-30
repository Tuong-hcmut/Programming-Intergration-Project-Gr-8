import Checkbox from '@/components/Checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InertiaFormField } from '@/components/ui/form';
import Guest from '@/Layouts/GuestLayout';
import { preventDefaultFormSubmit } from '@/lib/utils';
import { Head, useForm } from '@inertiajs/react';

export default function Welcome() {
    const form = useForm({
        email: '',
        password: '',
        remember: false,
    });

    return (
        <Guest>
            <Head title="Welcome" />

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        className="space-y-3"
                        onSubmit={preventDefaultFormSubmit(() =>
                            form.post(route('login')),
                        )}
                    >
                        <InertiaFormField
                            form={form}
                            fieldName="email"
                            displayName="Email"
                        />
                        <InertiaFormField
                            type="password"
                            form={form}
                            fieldName="password"
                            displayName="Password"
                        />
                        <label className="flex items-center">
                            <Checkbox
                                name="remember"
                                defaultChecked={form.data.remember}
                                onChange={(e) =>
                                    form.setData('remember', e.target.checked)
                                }
                            />
                            <span className="ms-2 text-sm">Remember me</span>
                        </label>
                        <div className="pt-2">
                            <Button type="submit">Login</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </Guest>
    );
}
