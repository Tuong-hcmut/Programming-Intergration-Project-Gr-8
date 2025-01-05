export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: App.Models.User;
    };
};

export type PaginationProps = {
    url: string;
    page: number;
    is_current: boolean;
}[];
