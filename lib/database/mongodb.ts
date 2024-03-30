import { User } from "@clerk/nextjs/server";
import { MongoClient, Document } from "mongodb";

export function connectToCluster<Collection extends Document>(collectionName: string) {
    let mongoClient;

    try {
        mongoClient = new MongoClient(process.env.MONGO_URL!);
        mongoClient.connect();

        const db = mongoClient.db('QUESTIONS');
        const collection = db.collection<Collection>(collectionName);

        return collection
    } catch (error) {
        console.error('Connection to MongoDB Atlas failed!', error);
        throw new Error(`Connection to MongoDB Atlas failed! ${error}`)
    }
}

export const collectionUser = connectToCluster<User>('users')
export const collectionCategory = connectToCluster<Category>('categories')
export const collectionQuestions = connectToCluster<Question>('questions')