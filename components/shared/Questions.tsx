"use client"

import QuestionCard from "./QuestionCard";
import { Button } from "../ui/button";
import { useState } from "react";
import Link from "next/link";

type QuestionsProps = {
    questions: QuestionProp[];
    checkAnswers: boolean;
}

export default function Questions({ questions/* , checkAnswers */ }: QuestionsProps) {
    const [checkAnswers, setCheckAnwers] = useState(false);
    const [allQuestions, setAllQuestions] = useState(questions)

    function CheckAnswers() {
        // const asnwers_0 = document.querySelector('button[id="question-0-answer"]:checked')
        // const asnwers_0 = document.querySelector('button[id="question-0-answer"][data-set="checked"]')
        const questionsWithAnswerSelected = questions.map((currentQuestion, questionIndex) => {
            const currentQuestionAsnwers = document.querySelectorAll(`button[id="question-${questionIndex}-answer"]`)
            const currentQuestionAsnwersArr = Array.from(currentQuestionAsnwers)

            const answerSelected = currentQuestionAsnwersArr.reduce((acc, c, index) => {
                if (c.attributes[3].value === "checked") {
                    acc = c.attributes[4].value
                }
                return acc
            }, "")

            return {
                ...currentQuestion,
                answerSelected
            }
        })

        setCheckAnwers(true)
        setAllQuestions(questionsWithAnswerSelected)
    }



    return (
        <section className="flex flex-col justify-center items-center gap-5">
            <div>
                {/* questions */allQuestions.map((question: QuestionProp, index: number) => (
                    <QuestionCard
                        key={index}
                        question={JSON.parse(JSON.stringify(question))}
                        questionIndex={index}
                        checkAnswers={checkAnswers}
                    />
                ))}
            </div>

            {checkAnswers === false && <Button onClick={CheckAnswers} variant={"link"}>Check answers</Button>/* <Button onClick={CheckAnswers}>Check answers</Button> */}
            {checkAnswers === true && <Link href={'/'}><Button variant={"link"}>Go home</Button></Link>}
            {checkAnswers === true && <div>
                Score = {/* questions */allQuestions.filter(c => c.answerSelected === c.correct_answer).length} / {/* questions */allQuestions.length}
            </div>}
        </section>
    )
}
