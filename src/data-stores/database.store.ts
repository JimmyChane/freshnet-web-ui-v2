import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { DataLoader } from '@/utils/DataLoader';
import { Processor } from '@/utils/Processor';
import { DatabaseRequest } from '@/data/Database';

export const useDatabaseStore = defineStore('database', () => {
  const lastModified = ref(0);
  const dataLoader = new DataLoader<any>(1000 * 5) // 5sec
    .processor(() => processor.value as Processor | undefined)
    .loadData(async () => {
      const api = await DatabaseRequest.info();
      const baseInfo = api.getContent();
      loadDatabases();
      return baseInfo;
    })
    .setData((data) => {
      baseInfo.value = data ? data : undefined;
      lastModified.value = Date.now();
    })
    .getData(() => baseInfo.value);
  const baseInfo = ref<any>(null);
  const items = ref<
    {
      name: string;
      collections: { name: string; documents: { _id: string }[] }[];
    }[]
  >([]);
  const processor = ref(new Processor());

  async function refresh() {
    return processor.value.acquire('refresh', async () => {
      dataLoader.doTimeout();
      await loadBaseInfo();
    });
  }

  async function loadBaseInfo() {
    return processor.value.acquire('loadBaseInfo', async () => {
      return dataLoader.data();
    });
  }
  async function loadDatabases() {
    return processor.value.acquire('loadDatabases', async () => {
      try {
        items.value = [];
        lastModified.value = Date.now();
        const api = await DatabaseRequest.databases();
        const contents = api.optArrayContent().map((database: any) => {
          return { name: database, collections: [] };
        });
        items.value = contents;
        for (const database of contents) {
          loadCollections({ database: database.name });
        }
        return items.value;
      } catch (error) {
        items.value = [];
        lastModified.value = Date.now();
        throw error;
      }
    });
  }
  async function loadCollections(arg: { database: any }) {
    return processor.value.acquire('loadCollections', async () => {
      const { database } = arg;
      const api = await DatabaseRequest.collections(database);
      const collections = api.optArrayContent().map((collection: any) => {
        return { name: collection, documents: [] };
      });
      const dbFound = await findDatabase({ database });
      while (dbFound.collections.length) {
        dbFound.collections.splice(0, dbFound.collections.length);
      }
      dbFound.collections.push(...collections);
      for (const collection of dbFound.collections) {
        const arg = { database: dbFound.name, collection: collection.name };
        loadDocuments(arg);
      }
      return dbFound.collections;
    });
  }
  async function loadDocuments(arg: { database: any; collection: string }) {
    return processor.value.acquire('loadDocuments', async () => {
      const { database, collection } = arg;
      const api = await DatabaseRequest.documents(database, collection);
      const documents = api.optArrayContent();
      const outputArg = { database, collection };
      const collectionFound = await findCollection(outputArg);
      while (collectionFound.documents.length) {
        collectionFound.documents.splice(0, collectionFound.documents.length);
      }
      collectionFound.documents.push(...documents);
      return collectionFound.documents;
    });
  }

  async function imports(arg: { json: any }) {
    return processor.value.acquire('imports', async () => {
      const { json } = arg;
      await DatabaseRequest.import({ content: json });
      throw new Error();
    });
  }
  async function exportDatabase(arg: { database: any }) {
    return processor.value.acquire('exportDatabase', async () => {
      const { database } = arg;
      return (await DatabaseRequest.export(database)).getContent();
    });
  }

  async function findDatabase(arg: {
    database: any;
  }): Promise<{ name: string; collections: any[] }> {
    return processor.value.acquire('findDatabase', async () => {
      const { database } = arg;
      const dbFound = items.value.find((db: { name: string }) => {
        return db.name === database;
      });
      if (!dbFound) throw new Error('database not found');

      return dbFound;
    });
  }
  async function findCollection(arg: { database: any; collection: string }) {
    return processor.value.acquire('findCollection', async () => {
      const { database, collection } = arg;
      const dbFound = await findDatabase({ database });
      const collectionFound = dbFound.collections.find((dbCollection: { name: string }) => {
        return dbCollection.name === collection;
      });
      if (!collectionFound) throw new Error('collection not found');

      return collectionFound;
    });
  }

  return {
    lastModified,
    isLoading: computed(() => processor.value.isLoading()),
    baseInfo,
    items,

    refresh,
    loadBaseInfo,
    loadDatabases,
    loadCollections,
    loadDocuments,
    imports,
    exportDatabase,
    findDatabase,
    findCollection,
  };
});
