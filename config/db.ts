import { Collection, Db, MongoClient, ServerApiVersion } from "mongodb";

interface Collections {
    workspaceCollection: Collection;
    bookingCollection: Collection;
    userCollection: Collection;
}

let client: MongoClient;
let db: Db | null = null;
let collections: Collections | null = null;
let connecting: Promise<{ db: Db; collections: Collections }> | null = null;

export const connectDb = async () => {
    if (db) return { db, collections };
    if (connecting) return connecting;

    connecting = (async () => {
        client = new MongoClient(process.env.MONGO_URI!, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: false,
                deprecationErrors: true,
            },
            serverSelectionTimeoutMS: 5000,
        });

        await client.connect();
        await client.db("admin").command({ ping: 1 });

        db = client.db(process.env.DB_NAME);
        collections = {
            workspaceCollection: db.collection(process.env.WORKSPACE_COLLECTION!),
            bookingCollection: db.collection(process.env.BOOKING_COLLECTION!),
            userCollection: db.collection(process.env.USER_COLLECTION!),
        };

        console.log("DB Connected");
        return { db, collections: collections! };
    })();

    try {
        return await connecting;
    } finally {
        connecting = null;
    };
};

export const getCollection = () => {
    if (!collections) {
        throw new Error("Database not initialized — connectDB() must run before any request is handled.")
    };
    return collections;
};

export const disconnectDb = async () => {
    await client.close();
    db = null;
    collections = null;
    console.log("Database Disconnected");
};