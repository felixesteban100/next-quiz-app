"use server";

import { revalidatePath } from "next/cache";

// import User from "../database/models/user.model";
// import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";
import { collectionUser } from "../database/mongodb";
import { OptionalId } from "mongodb";
import { User } from "@clerk/nextjs/server";

// CREATE
export async function createUser(user: CreateUserParams /* OptionalId<User> */) {
    try {
        // await connectToDatabase();
        // const newUser = await User.create(user);

        const newUser = await collectionUser.insertOne({ ...user })
        return JSON.parse(JSON.stringify(newUser))

    } catch (error) {
        handleError(error, "user.actions createUser");
    }
}

// READ
export async function getUserById(userId: string) {
    try {
        // await connectToDatabase();
        // const user = await User.findOne({ clerkId: userId });

        // const user = await collectionUser.findOne({ clerkId: userId })
        const user = await collectionUser.findOne({ userId })
        // const users = await collectionUser.find({}).toArray()

        if (!user) throw new Error("User not found");
        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        handleError(error, "user.actions getUserById");
    }
}

// UPDATE
export async function updateUser(clerkId: string, user: UpdateUserParams) {
    try {
        // await connectToDatabase();
        // const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
        //   new: true,
        // });

        const updatedUser = await collectionUser.findOneAndUpdate({ clerkId }, user);
        if (!updatedUser) throw new Error("User update failed");

        return JSON.parse(JSON.stringify(updatedUser));
    } catch (error) {
        handleError(error, "user.actions updateUser");
    }
}

// DELETE
export async function deleteUser(clerkId: string) {
    try {
        // await connectToDatabase();
        // Find user to delete
        // const userToDelete = await User.findOne({ clerkId });
        const userToDelete = await collectionUser.findOne({ clerkId });

        if (!userToDelete) {
            throw new Error("User not found");
        }

        // Delete user
        // const deletedUser = await User.findByIdAndDelete(userToDelete._id);
        const deletedUser = await collectionUser.findOneAndDelete({ _id: userToDelete._id });
        revalidatePath("/");

        return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
    } catch (error) {
        handleError(error, "user.actions deleteUser");
    }
}
