

import { getAllCategories } from "@/lib/actions/categories.actions";
import SelectQuizForm from "./SelectQuizForm";


export default async function SelectQuiz() {
    const categories/* : any */ = await getAllCategories()

    return (
        <SelectQuizForm categories={categories} />
    )
}
