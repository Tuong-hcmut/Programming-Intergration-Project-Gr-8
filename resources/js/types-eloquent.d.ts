/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Generated by laravel-typescriptable
declare namespace App.Models {
    export interface QuestionLibrary {
        id: number;
        owner_id: number;
        title: string;
        uuid: string;
        created_at?: string;
        updated_at?: string;
        questions_count?: number;
        owner?: App.Models.User;
        questions?: App.Models.Question[];
    }
  export interface Question {
      id: number;
      text: string;
      cue_words: any[];
      created_at?: string;
      updated_at?: string;
      question_library_id?: number;
      answers_count?: number;
      answers?: App.Models.Answer[];
      questionLibrary?: App.Models.QuestionLibrary;
  }
  export interface User {
      id: number;
      name: string;
      email: string;
      email_verified_at?: string;
      password: string;
      remember_token?: string;
      created_at?: string;
      updated_at?: string;
      is_teacher: number;
      answers_count?: number;
      question_libraries_count?: number;
      notifications_count?: number;
      answers?: App.Models.Answer[];
      questionLibraries?: App.Models.QuestionLibrary[];
      notifications?: any[];
  }
  export interface Answer {
    id: number
    question_id: number
    user_id: number
    audio_link: string
    transcript?: string
    created_at?: string
    updated_at?: string
    transcribed_words?: any[]
    user?: App.Models.User
    question?: App.Models.Question
  }
}

declare namespace App {
    export interface PaginateLink {
        url: string;
        label: string;
        active: boolean;
    }

    export interface Paginate<T = any> {
        data: T[];
        current_page: number;
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        links: App.PaginateLink[];
        next_page_url: string;
        path: string;
        per_page: number;
        prev_page_url: string;
        to: number;
        total: number;
    }

    export interface ApiPaginate<T = any> {
        data: T[];
        links: {
            first?: string;
            last?: string;
            prev?: string;
            next?: string;
        };
        meta: {
            current_page: number;
            from: number;
            last_page: number;
            links: App.PaginateLink[];
            path: string;
            per_page: number;
            to: number;
            total: number;
        };
    }
}
