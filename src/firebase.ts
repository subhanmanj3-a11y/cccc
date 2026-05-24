/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

let firebaseApp: FirebaseApp | null = null;
let dbInstance: Firestore | null = null;
let authInstance: Auth | null = null;
let isFirebaseReady = false;

// Check if configuration has valid parameters
const hasValidConfig = firebaseConfig && firebaseConfig.apiKey && firebaseConfig.apiKey !== "";

if (hasValidConfig) {
  try {
    if (!getApps().length) {
      firebaseApp = initializeApp(firebaseConfig);
    } else {
      firebaseApp = getApp();
    }
    dbInstance = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
    authInstance = getAuth(firebaseApp);
    isFirebaseReady = true;
    console.log("Firebase initialized successfully on active configuration.");
  } catch (error) {
    console.error("Firebase dynamic initialization failed: ", error);
  }
} else {
  console.log("Firebase has empty configuration. Seamless offline simulated synchronization is active.");
}

export const isConfigured = isFirebaseReady;
export const db = dbInstance;
export const auth = authInstance;

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: authInstance?.currentUser?.uid || null,
      email: authInstance?.currentUser?.email || null,
      emailVerified: authInstance?.currentUser?.emailVerified || null,
      isAnonymous: authInstance?.currentUser?.isAnonymous || null,
      tenantId: authInstance?.currentUser?.tenantId || null,
      providerInfo: authInstance?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Hardened Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
