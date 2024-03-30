import { getQuestions } from "@/lib/actions/questions.actions"
import { getQueryOptions } from "@/lib/utils";
import Questions from "./Questions";


type QuestionDisplayProps = {
    numberOfQuestions: number,
    category: string,
    type: string,
    difficulty: string;
    checkAnswers: boolean;
    // questionsFromUrlParams: QuestionProp[]
}

export default async function QuestionDisplay({ numberOfQuestions, category, type, difficulty, checkAnswers/* , questionsFromUrlParams */ }: QuestionDisplayProps) {

    const queryQuestions = await getQueryOptions(category, type, difficulty)
    const questions = /* questionsFromUrlParams.length > 0 ? questionsFromUrlParams :  */await getQuestions(queryQuestions, numberOfQuestions)

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