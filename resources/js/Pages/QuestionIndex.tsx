import { QuestionList } from '@/components/question-list';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PaginationProps } from '@/types';
import { Question } from '@/types/models';
import { Link } from '@inertiajs/react';

export default function QuestionIndex({
    questions,
    pagination,
}: {
    questions: Question[];
    pagination: PaginationProps;
}) {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    const showingUnanswered = type !== 'answered';

    return (
        <AuthenticatedLayout header="Dashboard">
            <div className="flex flex-col gap-5 rounded-lg bg-background p-5 md:p-10">
                <QuestionList
                    title={
                        showingUnanswered
                            ? 'New Questions'
                            : 'Attempted Questions'
                    }
                    questions={questions}
                    pagination={pagination}
                />
                {showingUnanswered ? (
                    <Link
                        href={route('questions', { type: 'answered' })}
                        className="underline"
                    >
                        View attempted questions
                    </Link>
                ) : (
                    <Link href={route('questions')} className="underline">
                        View new questions
                    </Link>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
