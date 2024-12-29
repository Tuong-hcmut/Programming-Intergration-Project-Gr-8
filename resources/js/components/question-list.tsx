import { AutoPagination } from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import { PaginationProps } from '@/types';
import { Question } from '@/types/models';
import { Link } from '@inertiajs/react';
import { CheckIcon } from 'lucide-react';

export function QuestionList({
    title,
    questions,
    pagination,
}: {
    title: string;
    questions: (Question & { answered?: boolean })[];
    pagination: PaginationProps;
}) {
    return (
        <div>
            <h1 className="mb-6 text-2xl font-bold">{title}</h1>
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
                                question.answered
                                    ? 'bg-green-50 hover:bg-green-100'
                                    : 'bg-white hover:bg-gray-50',
                            )}
                        >
                            <p className="flex-grow text-pretty text-sm md:text-lg">
                                {question.text}
                            </p>
                            {question.answered ? (
                                <CheckIcon
                                    className="absolute bottom-1 right-1 text-success"
                                    width={20}
                                    height={20}
                                />
                            ) : null}
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
