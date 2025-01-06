import { Link as InertiaLink, InertiaLinkProps } from '@inertiajs/react';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { LoaderCircleIcon } from 'lucide-react';

export interface LinkProps extends Omit<InertiaLinkProps, 'href'> {
    href?: string;
    noUnderline?: boolean;
}

const Link = React.forwardRef<InertiaLinkProps, LinkProps>(
    (
        {
            className,
            onClick,
            noUnderline,
            href,
            disabled,
            method,
            children,
            ...props
        },
        ref,
    ) => {
        const handleClick = (event: React.MouseEvent) => {
            if (onClick) {
                event.preventDefault();
                onClick(event);
            }
        };

        const [inProgress, setInProgress] = React.useState(false);

        return (
            <InertiaLink
                className={cn(
                    'hover:cursor-pointer',
                    !noUnderline && 'text-blue-900 underline',
                    className,
                )}
                ref={ref}
                href={href || '#'}
                onClick={handleClick}
                onStart={() => setInProgress(true)}
                onFinish={() => setInProgress(false)}
                onCancel={() => setInProgress(false)}
                disabled={inProgress || disabled}
                method={method}
                {...props}
            >
                {children}
                {inProgress && !!method && method !== 'get' && (
                    <LoaderCircleIcon className="size-8 animate-spin" />
                )}
            </InertiaLink>
        );
    },
);
Link.displayName = 'Link';

export { Link };
