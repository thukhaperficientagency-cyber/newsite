import {
  getApp,
  getApps,
  initializeApp
} from "firebase/app";

import {
  getAuth,
  inMemoryPersistence,
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

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export async function uploadImage(
  file: File,
  folder: string
): Promise<string> {
  if (!auth.currentUser) {
    throw new Error("ပုံတင်ရန် administrator အဖြစ် login ဝင်ထားရပါမယ်။");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Image file ကိုသာ upload လုပ်နိုင်ပါတယ်။");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("ပုံအရွယ်အစား 5MB ထက်မကျော်ရပါ။");
  }

  const safeName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-");

  const imageRef = ref(
    storage,
    `site-images/${folder}/${auth.currentUser.uid}/${Date.now()}-${safeName}`
  );

  const snapshot = await uploadBytes(imageRef, file, {
    contentType: file.type
  });

  return getDownloadURL(snapshot.ref);
}

export async function loginWithEmail(
  email: string,
  password: string
) {
  await setPersistence(auth, inMemoryPersistence);

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
  try {
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
  } catch (error) {
    console.error("Admin verification failed:", error);
    return false;
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout Error:", error);
  }
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo: FirestoreErrorInfo = {
    error:
      error instanceof Error
        ? error.message
        : String(error),

    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,

      providerInfo:
        auth.currentUser?.providerData?.map(
          (provider) => ({
            providerId: provider.providerId,
            email: provider.email
          })
        ) || []
    },

    operationType,
    path
  };

  console.error(
    "Firestore Error:",
    JSON.stringify(errInfo)
  );

  throw new Error(JSON.stringify(errInfo));
}
