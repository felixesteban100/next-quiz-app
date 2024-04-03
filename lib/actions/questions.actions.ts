"use server"

import { revalidatePath, unstable_noStore } from "next/cache";
import { collectionQuestions } from "../database/mongodb";
import { handleError } from "../utils";
import { ObjectId } from "mongodb";

export async function getQuestions(queryQuestions: QueryOptions, numberOfQuestions: number) {
    try {
        unstable_noStore()

        const questions = await collectionQuestions.find({ ...queryQuestions }).toArray();
        revalidatePath("/questions")
        return questions.sort(() => 0.5 - Math.random()).slice(0, numberOfQuestions)

    } catch (error) {
        handleError(error, 'questions.action getQuestions()')
    }
}

export async function createQuestion(questionInserted: Question) {
    try {
        const questions = await collectionQuestions.find({}).toArray()

        if (questions.some(q => q.question.toLowerCase() === questionInserted.question.toLowerCase())) {
            return 'This question already exists'
        }

        const questionCreated = collectionQuestions.insertOne(questionInserted)

        revalidatePath('/quiz')

        return JSON.parse(JSON.stringify(questionCreated))

    } catch (error) {
        handleError(error, 'questions.action createQuestion()');
    }
}

export async function getQuestionByIdForUser(questionId: string | undefined, userId: string) {
    if (!questionId || questionId === 'undefined') return

    const isIdValid = new RegExp("^[0-9a-fA-F]{24}$").test(questionId)

    if (!isIdValid) return

    try {
        const question = await collectionQuestions.findOne({ _id: new ObjectId(questionId), createdBy: userId })
        // revalidatePath("/questions")
        return question

    } catch (error) {
        handleError(error, 'questions.action getQuestions()')
    }
}

export async function getQuestionsByUser(userId: string) {
    try {
        const questions = await collectionQuestions.find({ createdBy: userId }).toArray()
        // if (!questions) throw new Error("Questions not found");
        return /* JSON.parse(JSON.stringify( */questions/* )) */;
    } catch (error) {
        handleError(error, "getQuestions() questions.action");
    }
}

export async function updateQuestion(questionInserted: Omit<Question, "createdAt" | "createdBy">, questionId: string) {
    if (!questionInserted) return
    try {
        const question = await collectionQuestions.findOneAndUpdate({ _id: new ObjectId(questionId) }, { $set: questionInserted })
        revalidatePath("/quiz")
        revalidatePath("/update-question")
        revalidatePath("/delete-question")

        return question

    } catch (error) {
        handleError(error, 'questions.action getQuestions()')
    }
}

export async function deleteQuestion(questionId: string) {
    try {
        const question = await collectionQuestions.findOneAndDelete({ _id: new ObjectId(questionId) })
        revalidatePath("/quiz")
        revalidatePath("/update-question")
        revalidatePath("/delete-question")

        return question

    } catch (error) {
        handleError(error, 'questions.action deleteQuestion()')
    }
}


