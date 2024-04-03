import FormQuestion from "@/components/shared/FormQuestion";
import SelectorQuestion from "@/components/shared/SelectorQuestion";
import { getCategories } from "@/lib/actions/categories.actions";
import { getQuestionByIdForUser, getQuestionsByUser } from "@/lib/actions/questions.actions";
import { currentUser } from '@clerk/nextjs';

export default async function update_question({
    searchParams,
}: {
    searchParams?: {
        selectedQuestionId: string,
    }
}) {

    const user = await currentUser();

    if (!user) return <div>Must be logged in to update questions</div>

    const selectedQuestionId = searchParams?.selectedQuestionId

    const selectedQuestionInfo = await getQuestionByIdForUser(selectedQuestionId, user.id)

    const categories = await getCategories()

    const allQuestions = await getQuestionsByUser(user.id)

    const pageAction = 'update'

    if (!allQuestions) return <div className="w-full flex justify-center items-center">
        <p>You don't have questions created</p>
    </div>

    /* if (!selectedQuestionInfo) return <div className="w-full flex justify-center items-center">
        <p>You don't access to that selectedQuestionInfo</p>
    </div> */

    return (
        <div className="w-full">
            {((!selectedQuestionId || selectedQuestionId === 'undefined')) && <SelectorQuestion
                allQuestions={allQuestions}
                selectedQuestionInfo={selectedQuestionInfo}
                pageAction={pageAction}
            />}

            {selectedQuestionInfo ?
                <FormQuestion
                    FormAction={pageAction}
                    categories={categories}
                    category={selectedQuestionInfo?.category}
                    correct_answer={selectedQuestionInfo?.correct_answer}
                    difficulty={selectedQuestionInfo?.difficulty}
                    image_url={selectedQuestionInfo?.image_url}
                    incorrect_answers={selectedQuestionInfo?.incorrect_answers}
                    question={selectedQuestionInfo?.question}
                    type={selectedQuestionInfo?.type}
                    selectedQuestionId={selectedQuestionInfo._id.toString()}
                />
                :
                <div className="text-center my-10">No question id provided, select a question</div>
            }
        </div>
    )
}