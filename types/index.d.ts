/* eslint-disable no-unused-vars */

// ====== USER PARAMS
declare type CreateUserParams = {
    clerkId: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    photo: string;
};

declare type UpdateUserParams = {
    firstName: string;
    lastName: string;
    username: string;
    photo: string;
};


declare type Category = {
    name: string;
    id: number;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

declare type TriviaCategories = Omit<Category, "createdAt" | "updatedAt" | "createdBy">[]

declare type CategoryExternal = {
    trivia_categories: TriviaQuestions;
}

declare type Question = {
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    question: string;
    type: string;
    correct_answer: string;
    incorrect_answers: string[];
    category: string;
    difficulty: string;
    image_url: string;
}

declare type ResultQuestions = Omit<Question, "createdAt" | "updatedAt" | "createdBy">[]

declare type QuestionExternal = {
    response_code: number,
    results: ResultQuestions
}

declare type QueryOptions = {
    category?: string;
    type?: string;
    difficulty?: string;
}

declare type QuestionProp = {
    allAnswers: string[];
    answerSelected: string;
    question: string;
    image_url: string;
    type: string;
    correct_answer: string;
    category: string;
    difficulty: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    incorrect_answers: string[];
    _id: ObjectId;
}

declare type FormAction = 'create' | 'update' | 'delete'