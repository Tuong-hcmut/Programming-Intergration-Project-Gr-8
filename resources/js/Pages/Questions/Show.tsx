import { QuestionWithAnswer } from '@/Components/question-with-answer';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function QuestionsShow({
    question,
}: {
    question: App.Models.Question;
}) {
    return (
        <Authenticated>
            <Head title="Welcome" />

            <QuestionWithAnswer question={question} />
        </Authenticated>
    );
}
