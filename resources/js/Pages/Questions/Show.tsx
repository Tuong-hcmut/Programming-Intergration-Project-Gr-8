import { QuestionWithAnswer } from '@/components/question-with-answer';
import { Link } from '@/components/ui/link';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Answer, Question } from '@/types/models';
import { ChevronLeftIcon } from '@radix-ui/react-icons';

export default function QuestionsShow({
    question,
    answers,
}: {
    question: Question;
    answers: Answer[];
}) {
    return (
        <Authenticated header="Attempt question">
            <div className="max-w-constrained mx-auto">
                {question.question_library && (
                    <div className="mb-4">
                        <Link
                            href={route(
                                'question-library.edit',
                                question.question_library.uuid,
                            )}
                            className="flex items-center gap-1"
                        >
                            <ChevronLeftIcon />
                            <span>Back to Library</span>
                        </Link>
                    </div>
                )}
                <QuestionWithAnswer question={question} answers={answers} />
            </div>
        </Authenticated>
    );
}
