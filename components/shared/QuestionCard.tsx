"use client"

import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/label"
// import { Dispatch, SetStateAction } from "react"

type QuestionCardProps = {
    question: QuestionProp/* WithId<Question> & { allAnswers: string[] } */;
    questionIndex: number
    checkAnswers: boolean
}

export default function QuestionCard({ question, checkAnswers, questionIndex }: QuestionCardProps) {
    return (
        <div className="border-b flex flex-col gap-5 justify-center items-center p-5 pb-8">
            <p><span>{questionIndex + 1}. </span>{question.question}</p>
            <p><span>Difficulty: </span><span className={`${question.difficulty === "hard" ? "text-red-500" : question.difficulty === "medium" ? "text-yellow-500" : "text-green-500"} capitalize`}>{question.difficulty}</span></p>
            <p><span>Category: </span><span className={` capitalize`}>{question.category}</span></p>
            {question.image_url &&
                <img
                    src={question.image_url}
                    // className="h-96 w-auto object-cover"
                    className="h-auto w-[40rem] object-cover"
                    alt={question.question}
                />
            }
            <RadioGroup id={`question-${questionIndex}`} /* onValueChange={(selected) => setAllQuestions((prev) => {
                return prev.map((c, index) => {
                    if (index === questionIndex) {
                        return {
                            ...c,
                            answerSelected: selected
                        }
                    } else {
                        return c
                    }
                })
            })} */ disabled={checkAnswers} defaultValue={question.answerSelected}>
                {question.allAnswers.map((answer, answerIndex) => {
                    const answerId = `question-${questionIndex}-answer`
                    return (
                        <div key={`${answerId}-${answerIndex}`} className={`flex items-center space-x-2 ${(checkAnswers && (answer === question.correct_answer && question.answerSelected === answer)) ? "text-green-400" : ""} ${checkAnswers && (question.answerSelected === answer && answer !== question.correct_answer) ? "text-red-400" : ""}`}>
                            <RadioGroupItem id={answerId} value={answer} />
                            <Label htmlFor={answerId}>{answer}</Label>
                        </div>
                    )
                })}
            </RadioGroup>
            {checkAnswers && <div className="my-5 text-primary p-5 border rounded-md">
                Correct Answer: {question.correct_answer}
            </div>}
        </div>
    )
}