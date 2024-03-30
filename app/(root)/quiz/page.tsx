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
        numberOfQuestions?: string,
        category?: string,
        type?: string,
        difficulty?: string;
        checkAnswers?: string;
        questions?: string;
    }
}) {

    const numberOfQuestions = parseInt(searchParams?.numberOfQuestions ?? "3")
    const category = searchParams?.category ?? "all"
    const type = searchParams?.type ?? "all"
    const difficulty = searchParams?.difficulty ?? "all"
    const checkAnswers = searchParams?.checkAnswers === "true"
    // const questionsFromUrlParams = JSON.parse(searchParams?.questions ?? '[]')

    return (
        <div>
            <Suspense key={`${numberOfQuestions}-${category}-${type}-${difficulty}-${checkAnswers}`} fallback={<>Loading QuestionDisplay Component...</>}>
                <QuestionDisplay
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