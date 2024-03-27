import { MongoClient } from "mongodb";

export function connectToCluster(collectionName: string) {
    let mongoClient;

    try {
        mongoClient = new MongoClient(process.env.MONGO_URL!);
        mongoClient.connect();

        const db = mongoClient.db('test');
        const collection = db.collection(collectionName);

        return collection
    } catch (error) {
        console.error('Connection to MongoDB Atlas failed!', error);
        throw new Error(`Connection to MongoDB Atlas failed! ${error}`)
    }
}

export const collectionUser = connectToCluster('users')
export const collectionCategory = connectToCluster('category')
export const collectionQuestions = connectToCluster('questions')