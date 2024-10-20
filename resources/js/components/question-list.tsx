import { AutoPagination } from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import { PaginationProps } from '@/types';
import { Question } from '@/types/models';
import { Link } from '@inertiajs/react';

export function QuestionList({
    questions,
    pagination,
}: {
    questions: Question[];
    pagination: PaginationProps;
}) {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="mb-6 text-2xl font-bold">New Questions</h1>
            <div className="space-y-2">
                {questions.map((question) => (
                    <Link
                        href={route('question.show', question.id)}
                        key={question.id}
                        className="block"
                    >
                        <div
                            className={cn(
                                'relative flex cursor-pointer items-center justify-between gap-3 rounded-lg border p-3 transition-all duration-200',
                                question.answers_count
                                    ? 'bg-green-50 hover:bg-green-100'
                                    : 'hover:bg-gray-50',
                            )}
                        >
                            <p className="flex-grow text-pretty text-sm md:text-lg">
                                {question.text}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="mt-8">
                <AutoPagination pagination={pagination} />
            </div>
        </div>
    );
}
