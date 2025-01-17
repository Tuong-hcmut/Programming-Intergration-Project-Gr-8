import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { fromPairs, toPairs } from 'ramda';
import { FormEventHandler, useCallback } from 'react';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const useUser = () =>
    usePage().props.auth.user as App.Models.User | null;

export const secondsToTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const useQuery = <Params extends Record<string, any>>(props: {
    [Key in keyof Params]: (val: string | null) => Params[Key];
}) => {
    const params = URL.parse(usePage().url, window.location.href)!.searchParams;

    return fromPairs(
        toPairs(props).map(([key, fn]) => [key, fn(params.get(String(key)))]),
    );
};

export const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

export const useWaitForData = <T extends Record<string, unknown>>(
    selector: (props: PageProps<T>) => any,
    delay = 1000,
) => {
    const { version } = usePage();

    return useCallback(async () => {
        // eslint-disable-next-line no-constant-condition
        while (true) {
            await sleep(delay);

            const resp = await fetch(window.location.href, {
                headers: {
                    'X-Inertia': 'true',
                    'X-Inertia-Version': version!,
                },
            });
            const json = (await resp.json()) as {
                props: PageProps<T>;
            };

            if (selector(json.props)) {
                return;
            }
        }
    }, [delay, version, selector]);
};

export const preventDefaultFormSubmit =
    (handler: FormEventHandler) => (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handler(e);
    };
