import QuestionDisplay from "@/components/shared/QuestionDisplay";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: 'Questions',
}

export default async function quiz({
    searchParams,
}: {
    searchParams?: {
        api?: string,
        numberOfQuestions?: string,
        category?: string,
        type?: string,
        difficulty?: string;
        checkAnswers?: string;
        questions?: string;
    }
}) {

    const api = searchParams?.api ?? "3"
    const numberOfQuestions = parseInt(searchParams?.numberOfQuestions ?? "3")
    const category = searchParams?.category ?? "all"
    const type = searchParams?.type ?? "all"
    const difficulty = searchParams?.difficulty ?? "all"
    const checkAnswers = searchParams?.checkAnswers === "true"
    // const questionsFromUrlParams = JSON.parse(searchParams?.questions ?? '[]')

    return (
        <div>
            <Suspense key={`${api}-${numberOfQuestions}-${category}-${type}-${difficulty}-${checkAnswers}`} fallback={<>Loading QuestionDisplay Component...</>}>
                <QuestionDisplay
                    api={api}
                    category={category}
                    difficulty={difficulty}
                    type={type}
                    numberOfQuestions={numberOfQuestions}
                    checkAnswers={checkAnswers}
                // questionsFromUrlParams={questionsFromUrlParams}
                />
            </Suspense>
        </div>
    )
} 