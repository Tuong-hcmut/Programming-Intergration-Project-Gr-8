type ExtendModel<
    Model extends Record<string, any>,
    Extension extends Partial<Record<keyof Model, any>>,
> = Omit<Model, keyof Extension> & Extension;

export type Question = ExtendModel<App.Models.Question, {}>;
export type Answer = ExtendModel<
    App.Models.Answer,
    {
        transcribed_words: { word: string; start: number; end: number }[];
    }
>;
export type User = ExtendModel<App.Models.User, {}>;
