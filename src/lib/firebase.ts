import {
  getApp,
  getApps,
  initializeApp
} from "firebase/app";

import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

import {
  doc,
  getDoc,
  getFirestore
} from "firebase/firestore";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes
} from "firebase/storage";

import {
  FirestoreErrorInfo,
  OperationType
} from "../types";

import firebaseConfig from "../../firebase-applet-config.json";

const app = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export async function loginWithEmail(
  email: string,
  password: string
) {
  // Refresh/new tab ဖွင့်လည်း login session မပျောက်စေရန်
  await setPersistence(auth, browserLocalPersistence);

  const result = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );

  return result.user;
}

export async function checkIsAdmin(
  uid: string
): Promise<boolean> {
  const adminSnapshot = await getDoc(
    doc(db, "admins", uid)
  );

  if (!adminSnapshot.exists()) {
    return false;
  }

  const adminData = adminSnapshot.data();

  return (
    adminData.active === true &&
    adminData.role === "admin"
  );
}

export async function uploadImage(
  file: File,
  folder: string
): Promise<string> {
  if (!auth.currentUser) {
    throw new Error(
      "ပုံတင်ရန် administrator အဖြစ် login ဝင်ထားရပါမယ်။"
    );
  }

  if (!file.type.startsWith("image/")) {
    throw new Error(
      "Image file ကိုသာ upload လုပ်နိုင်ပါတယ်။"
    );
  }

  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error(
      "ပုံအရွယ်အစား 5MB ထက်မကျော်ရပါ။"
    );
  }

  const safeFileName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-");

  const imageReference = ref(
    storage,
    [
      "site-images",
      folder,
      auth.currentUser.uid,
      `${Date.now()}-${safeFileName}`
    ].join("/")
  );

  const uploadResult = await uploadBytes(
    imageReference,
    file,
    {
      contentType: file.type
    }
  );

  return getDownloadURL(uploadResult.ref);
}

export async function logoutUser() {
  await signOut(auth);
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const firebaseError = error as {
    code?: string;
    message?: string;
  };

  const errInfo: FirestoreErrorInfo = {
    error:
      firebaseError?.message ||
      (error instanceof Error
        ? error.message
        : String(error)),

    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,

      providerInfo:
        auth.currentUser?.providerData.map(
          (provider) => ({
            providerId: provider.providerId,
            email: provider.email
          })
        ) || []
    },

    operationType,
    path
  };

  console.error("Firestore Error:", {
    code: firebaseError?.code,
    ...errInfo
  });

  if (firebaseError?.code === "permission-denied") {
    throw new Error(
      "Firebase permission ပိတ်ထားပါတယ်။ Admin record နဲ့ Rules ကိုစစ်ပါ။"
    );
  }

  if (firebaseError?.code === "unauthenticated") {
    throw new Error(
      "Login session မရှိတော့ပါ။ Administrator အဖြစ်ပြန်ဝင်ပါ။"
    );
  }

  throw new Error(errInfo.error);
}
