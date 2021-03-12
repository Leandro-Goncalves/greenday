import url from 'url';
import { MongoClient, Db } from 'mongodb';

export default async function connectToDatabase(uri: string) {

  
  let cachedDb: Db = null;

  if(cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const dbName = url.parse(uri).pathname.substr(1);

  const db = client.db(dbName);

  cachedDb = db;

  return db;
}