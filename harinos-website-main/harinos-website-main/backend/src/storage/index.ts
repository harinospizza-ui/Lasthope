import { config } from '../config.js';
import { firebaseStore } from './firebaseStore.js';
import { jsonStore } from './jsonStore.js';
import { mysqlStore } from './mysqlStore.js';
import { OrderStore } from './store.js';

export const getOrderStore = (): OrderStore => {
  if (config.storage.driver === 'mysql') return mysqlStore;
  if (config.storage.driver === 'firebase') return firebaseStore;
  return jsonStore;
};
