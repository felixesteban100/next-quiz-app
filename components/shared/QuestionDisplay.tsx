import { getQuestions } from "@/lib/actions/questions.actions"
import { getQueryOptions } from "@/lib/utils";
import Questions from "./Questions";


type QuestionDisplayProps = {
    api: string,
    numberOfQuestions: number,
    category: string,
    type: string,
    difficulty: string;
    checkAnswers: boolean;
}

export default async function QuestionDisplay({ api, numberOfQuestions, category, type, difficulty, checkAnswers }: QuestionDisplayProps) {
    const queryQuestions = await getQueryOptions(category, type, difficulty)
    const questionsNative = await getQuestions(queryQuestions, numberOfQuestions)

    const questionsExternal: QuestionExternal = await fetch(constructLink()).then(res => res.json())

    const questions = api === "native" ? questionsNative : questionsExternal.results

    function constructLink(): string {
        const queryParams: { [key: string]: string | number | undefined } = {
            amount: numberOfQuestions,
            category,
            type,
            difficulty
        };

        const queryParamsString = Object.entries(queryParams)
            .filter(([_, value]) => (value !== undefined && value !== "all"))
            .map(([key, value]) => `${key}=${value as string}`)
            .join('&');

        return `https://opentdb.com/api.php?${queryParamsString}`;
    }

    if (!questions) return <>Error fething Questions</>
    if (questions && questions.length < 1) return <div>No questions found</div>

    const questionsWithAnswersRandomSorted = questions.map((c) => {
        return { ...c, allAnswers: [...c.incorrect_answers, c.correct_answer].sort(() => Math.random() - 0.5), answerSelected: "" }
    })

    return (
        <div>
            <Questions
                questions={JSON.parse(JSON.stringify(questionsWithAnswersRandomSorted))}
                checkAnswers={checkAnswers}
            />
        </div>
    )
}