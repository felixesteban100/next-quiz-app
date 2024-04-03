

import { getCategories } from "@/lib/actions/categories.actions";
import SelectQuizForm from "./SelectQuizForm";


export default async function SelectQuiz() {
    const categories/* : any */ = await getCategories()

    return (
        <SelectQuizForm categories={categories} />
    )
}
