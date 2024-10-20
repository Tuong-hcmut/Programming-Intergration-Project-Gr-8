import {
    ChevronLeftIcon,
    ChevronRightIcon,
    DotsHorizontalIcon,
} from '@radix-ui/react-icons';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { PaginationProps } from '@/types';
import { InertiaLinkProps, Link } from '@inertiajs/react';
import { ButtonProps, buttonVariants } from './button';

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
    <nav
        role="navigation"
        aria-label="pagination"
        className={cn('mx-auto flex w-full justify-center', className)}
        {...props}
    />
);
Pagination.displayName = 'Pagination';

const PaginationContent = React.forwardRef<
    HTMLUListElement,
    React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
    <ul
        ref={ref}
        className={cn('flex flex-row items-center gap-1', className)}
        {...props}
    />
));
PaginationContent.displayName = 'PaginationContent';

const PaginationItem = React.forwardRef<
    HTMLLIElement,
    React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
    <li ref={ref} className={cn('', className)} {...props} />
));
PaginationItem.displayName = 'PaginationItem';

type PaginationLinkProps = {
    isActive?: boolean;
    onProgress?: InertiaLinkProps['onProgress'];
    onError?: InertiaLinkProps['onError'];
} & Pick<ButtonProps, 'size'> &
    React.ComponentProps<'a'>;

const PaginationLink = ({
    className,
    isActive,
    size = 'icon',
    href,
    ...props
}: PaginationLinkProps) => (
    <Link
        aria-current={isActive ? 'page' : undefined}
        className={cn(
            buttonVariants({
                variant: isActive ? 'outline' : 'ghost',
                size,
            }),
            className,
        )}
        href={href || '#'}
        {...props}
    />
);
PaginationLink.displayName = 'PaginationLink';

const PaginationPrevious = ({
    className,
    ...props
}: React.ComponentProps<typeof PaginationLink>) => (
    <PaginationLink
        aria-label="Go to previous page"
        size="default"
        className={cn('gap-1 pl-2.5', className)}
        {...props}
    >
        <ChevronLeftIcon className="h-4 w-4" />
        <span>Prev</span>
    </PaginationLink>
);
PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = ({
    className,
    ...props
}: React.ComponentProps<typeof PaginationLink>) => (
    <PaginationLink
        aria-label="Go to next page"
        size="default"
        className={cn('gap-1 pr-2.5', className)}
        {...props}
    >
        <span>Next</span>
        <ChevronRightIcon className="h-4 w-4" />
    </PaginationLink>
);
PaginationNext.displayName = 'PaginationNext';

const PaginationEllipsis = ({
    className,
    ...props
}: React.ComponentProps<'span'>) => (
    <span
        aria-hidden
        className={cn('flex h-9 w-9 items-center justify-center', className)}
        {...props}
    >
        <DotsHorizontalIcon className="h-4 w-4" />
        <span className="sr-only">More pages</span>
    </span>
);
PaginationEllipsis.displayName = 'PaginationEllipsis';

const AutoPagination = ({
    className,
    pagination,
    ...props
}: React.ComponentProps<typeof Pagination> & {
    pagination: PaginationProps;
}) => {
    const findPage = (page: number) => pagination.find((p) => p.page === page);
    const currentPage = pagination.find((p) => p.is_current);

    return (
        <Pagination className={cn('', className)} {...props}>
            <PaginationContent>
                {[
                    <PaginationPrevious
                        key="prev-link"
                        href={findPage(currentPage!.page - 1)?.url}
                    />,
                    ...pagination
                        .map((page, index) => [
                            index > 1 &&
                                pagination[index - 1]!.page + 1 !==
                                    page.page && (
                                    <PaginationEllipsis
                                        key={`${index}-ellipsis`}
                                    />
                                ),
                            <PaginationLink
                                key={index}
                                isActive={page.is_current}
                                href={page.url}
                            >
                                {page.page}
                            </PaginationLink>,
                        ])
                        .flat(),
                    <PaginationNext
                        key="next-link"
                        href={findPage(currentPage!.page + 1)?.url}
                    />,
                ]
                    .filter(Boolean)
                    .map((item, index) => (
                        <PaginationItem key={index}>{item}</PaginationItem>
                    ))}
            </PaginationContent>
        </Pagination>
    );
};
AutoPagination.displayName = 'AutoPagination';

export {
    AutoPagination,
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
};
