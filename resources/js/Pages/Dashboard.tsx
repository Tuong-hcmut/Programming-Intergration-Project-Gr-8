import { QuestionList } from '@/components/question-list';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PaginationProps } from '@/types';
import { Question } from '@/types/models';
import { Head } from '@inertiajs/react';

export default function Dashboard({
    questions,
    pagination,
}: {
    questions: (Question & { answers_count: number })[];
    pagination: PaginationProps;
}) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="rounded-lg bg-background">
                <QuestionList questions={questions} pagination={pagination} />
            </div>
        </AuthenticatedLayout>
    );
}
