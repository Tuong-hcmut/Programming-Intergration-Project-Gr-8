import { QuestionWithAnswer } from '@/Components/question-with-answer';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function QuestionsShow({
    question,
    answer,
}: {
    question: App.Models.Question;
    answer: App.Models.Answer;
}) {
    return (
        <Authenticated>
            <Head title="Welcome" />

            <QuestionWithAnswer question={question} answer={answer} />
        </Authenticated>
    );
}
