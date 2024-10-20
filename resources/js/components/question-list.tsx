import { AutoPagination } from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import { PaginationProps } from '@/types';
import { Question } from '@/types/models';
import { Link } from '@inertiajs/react';
import { CheckIcon } from 'lucide-react';
import { useState } from 'react';

// // Sample questions data
// const questions = [
//     {
//         id: 1,
//         text: "Talk about a recent tournament you've attended, and what did you achieve after that?",
//         completed: true,
//     },
//     {
//         id: 2,
//         text: "Describe a challenging coding problem you've solved recently. What was your approach?",
//         completed: false,
//     },
//     {
//         id: 3,
//         text: 'Share an experience where you had to work in a team to complete a project. What was your role?',
//         completed: true,
//     },
//     {
//         id: 4,
//         text: "Discuss a book you've read lately that had a significant impact on your thinking.",
//         completed: false,
//     },
//     {
//         id: 5,
//         text: 'Explain a complex concept from your field of study to someone outside that field.',
//         completed: true,
//     },
//     // Add more questions here...
// ];

export function QuestionList({
    questions,
    pagination,
}: {
    questions: (Question & { answers_count: number })[];
    pagination: PaginationProps;
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 10; // Assume 10 pages for this example
    const pageSize = 50; // 50 questions per page

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="mb-6 text-2xl font-bold">Question List</h1>
            <div className="space-y-2">
                {questions.map((question) => (
                    <Link
                        href={route('question.show', question.id)}
                        key={question.id}
                        className="block"
                    >
                        <div
                            className={cn(
                                'relative flex cursor-pointer items-center justify-between rounded-lg border p-3 text-sm transition-all duration-200',
                                question.answers_count
                                    ? 'bg-green-50 hover:bg-green-100'
                                    : 'hover:bg-gray-50',
                            )}
                        >
                            <p className="flex-grow text-pretty pr-4">
                                {question.text}
                            </p>
                            {question.answers_count > 0 && (
                                <CheckIcon
                                    className="text-success absolute bottom-1 right-1"
                                    width={20}
                                    height={20}
                                />
                            )}
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
