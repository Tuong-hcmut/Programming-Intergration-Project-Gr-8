import { Card, CardContent } from '@/components/ui/card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';

export default function Dashboard({
    question_libraries,
}: {
    question_libraries: App.Models.QuestionLibrary[];
}) {
    return (
        <AuthenticatedLayout header="Dashboard">
            <div className="max-w-constrained mx-auto grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-2">
                {question_libraries.map((library) => (
                    <Card key={library.uuid}>
                        <CardContent>
                            <Link
                                href={route('question-library.edit', {
                                    id: library.uuid,
                                })}
                            >
                                {' '}
                                <div className="mb-3 font-bold">
                                    {library.title}
                                </div>
                            </Link>
                            <div className="text-sm text-muted-foreground">
                                {library.questions_count} questions
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </AuthenticatedLayout>
    );
}
