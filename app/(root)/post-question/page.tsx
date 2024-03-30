
import FormQuestion from "@/components/shared/FormQuestion";
import { getAllCategories } from "@/lib/actions/categories.actions";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Create question',
}

export default async function post_question() {
    const categories: any = await getAllCategories()

    return (
        <FormQuestion
            categories={categories}
            question={undefined}
            type={undefined}
            correct_answer={undefined}
            incorrect_answers={[]}
            category={undefined}
            difficulty={'easy'}
            image_url={undefined}
            FormAction="create"
        />
    )
}