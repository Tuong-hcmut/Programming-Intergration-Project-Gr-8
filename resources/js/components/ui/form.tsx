import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import {
    Controller,
    ControllerProps,
    FieldPath,
    FieldValues,
    FormProvider,
    useFormContext,
} from 'react-hook-form';

import { Input, InputProps } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

import { Textarea } from '@/components/ui/textarea';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
// @ts-expect-error TS2307: Cannot find module @inertiajs/react/types/useForm or its corresponding type declarations.
import { InertiaFormProps } from '@inertiajs/react/types/useForm';
import { SelectProps } from '@radix-ui/react-select';

const Form = FormProvider;

type FormFieldContextValue<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
    name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
    {} as FormFieldContextValue,
);

const FormField = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
    ...props
}: ControllerProps<TFieldValues, TName>) => {
    return (
        <FormFieldContext.Provider value={{ name: props.name }}>
            <Controller {...props} />
        </FormFieldContext.Provider>
    );
};

const useFormField = () => {
    const fieldContext = React.useContext(FormFieldContext);
    const itemContext = React.useContext(FormItemContext);
    const { getFieldState, formState } = useFormContext();

    const fieldState = getFieldState(fieldContext.name, formState);

    if (!fieldContext) {
        throw new Error('useFormField should be used within <FormField>');
    }

    const { id } = itemContext;

    return {
        id,
        name: fieldContext.name,
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`,
        ...fieldState,
    };
};

type FormItemContextValue = {
    id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
    {} as FormItemContextValue,
);

const FormItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    const id = React.useId();

    return (
        <FormItemContext.Provider value={{ id }}>
            <div ref={ref} className={cn('space-y-2', className)} {...props} />
        </FormItemContext.Provider>
    );
});
FormItem.displayName = 'FormItem';

const FormLabel = React.forwardRef<
    React.ElementRef<typeof LabelPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
    const { error, formItemId } = useFormField();

    return (
        <Label
            ref={ref}
            className={cn(error && 'text-destructive', className)}
            htmlFor={formItemId}
            {...props}
        />
    );
});
FormLabel.displayName = 'FormLabel';

const FormControl = React.forwardRef<
    React.ElementRef<typeof Slot>,
    React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
    const { error, formItemId, formDescriptionId, formMessageId } =
        useFormField();

    return (
        <Slot
            ref={ref}
            id={formItemId}
            aria-describedby={
                !error
                    ? `${formDescriptionId}`
                    : `${formDescriptionId} ${formMessageId}`
            }
            aria-invalid={!!error}
            {...props}
        />
    );
});
FormControl.displayName = 'FormControl';

const FormDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ ...props }, ref) => {
    const { formDescriptionId } = useFormField();

    return <FieldDescription ref={ref} id={formDescriptionId} {...props} />;
});
FormDescription.displayName = 'FormDescription';

const FieldDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
    return (
        <p
            ref={ref}
            className={cn('text-[0.8rem] text-muted-foreground', className)}
            {...props}
        >
            {children}
        </p>
    );
});
FieldDescription.displayName = 'FieldDescription';

const FormMessage = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message) : children;

    return (
        <FieldErrorMessage ref={ref} id={formMessageId} {...props}>
            {body}
        </FieldErrorMessage>
    );
});
FormMessage.displayName = 'FormMessage';

const FieldErrorMessage = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
    if (!children) {
        return null;
    }

    return (
        <p
            ref={ref}
            className={cn(
                'text-[0.8rem] font-medium text-destructive first-letter:uppercase',
                className,
            )}
            {...props}
        >
            {children}
        </p>
    );
});
FieldErrorMessage.displayName = 'FieldErrorMessage';

const InertiaFormField = <
    Form extends InertiaFormProps<FData>,
    FData extends Form['data'],
    FieldName extends keyof FData & string,
    FieldType extends FData[FieldName],
>({
    className,
    form,
    fieldName,
    displayName,
    type = 'text',
    toDisplay = (value) => String(value),
    toValue = (display) => display as FieldType,
    optional = false,
    inputProps = {},
    ...props
}: React.HTMLAttributes<HTMLDivElement> & {
    form: Form;
    fieldName: FieldName;
    displayName: string;
    type?: InputProps['type'] | 'textarea';
    toDisplay?: (value: FieldType) => string;
    toValue?: (display: string) => FieldType;
    optional?: boolean;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}) => {
    return (
        <div className={cn('flex flex-col space-y-1.5', className)} {...props}>
            <Label
                htmlFor={`form-field-${fieldName}`}
                className="inline-block w-full"
            >
                {displayName}
                {!optional && <span className="text-destructive">{' *'}</span>}
            </Label>
            <div className="space-y-0.5">
                {type !== 'textarea' ? (
                    <Input
                        id={`form-field-${fieldName}`}
                        type={type}
                        defaultValue={toDisplay(form.data[fieldName])}
                        onChange={(e) =>
                            form.setData(fieldName, toValue(e.target.value))
                        }
                        required={!optional}
                        {...inputProps}
                    />
                ) : (
                    <Textarea
                        id={`form-field-${fieldName}`}
                        defaultValue={toDisplay(form.data[fieldName])}
                        onChange={(e) =>
                            form.setData(fieldName, toValue(e.target.value))
                        }
                        required={!optional}
                        rows={5}
                    />
                )}
                <FieldErrorMessage>{form.errors[fieldName]}</FieldErrorMessage>
            </div>
        </div>
    );
};
InertiaFormField.displayName = 'InertialFormField';

const InertialFormSelectField = <
    Form extends InertiaFormProps<FData>,
    FData extends Form['data'],
    FieldName extends keyof FData & string,
>({
    className,
    form,
    fieldName,
    displayName,
    options,
    optional = false,
    inputProps = {},
    ...props
}: React.HTMLAttributes<HTMLDivElement> & {
    form: Form;
    fieldName: FieldName;
    displayName: string;
    options: { label: string; value: FData[FieldName] }[];
    optional?: boolean;
    inputProps?: SelectProps;
}) => {
    return (
        <div className={cn('flex flex-col space-y-1.5', className)} {...props}>
            <Label htmlFor={`form-field-${fieldName}`}>
                {displayName}
                {!optional && <span className="text-destructive">{' *'}</span>}
            </Label>
            <div className="space-y-0.5">
                <Select
                    onValueChange={(value) => form.setData(fieldName, value)}
                    required={!optional}
                    defaultValue={form.data[fieldName]}
                    {...inputProps}
                >
                    <SelectTrigger>
                        <SelectValue placeholder={displayName} />
                    </SelectTrigger>
                    <SelectContent id={`form-field-${fieldName}`}>
                        {options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FieldErrorMessage>{form.errors[fieldName]}</FieldErrorMessage>
            </div>
        </div>
    );
};
InertialFormSelectField.displayName = 'InertialFormSelectField';

export {
    FieldDescription,
    FieldErrorMessage,
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    InertiaFormField,
    InertialFormSelectField,
    useFormField,
};
