import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth } from "../config/firebaseConfig";

const db = getFirestore();

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const registerUser = async (fullName: string, email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: fullName });

    return { user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return null;
  } catch (error: any) {
    return error.message;
  }
};

type Task = {
  id: string;
  title: string;
  description: string;
  timestamp: any;
  reminder?: string;
  tags?: string[];
  isCompleted: boolean;
};

export const getUserTasks = async (): Promise<{ tasks: Task[]; error: string | null }> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    const tasksRef = collection(doc(collection(db, "users"), user.uid), "tasks");
    const tasksSnapshot = await getDocs(tasksRef);
    
    const tasks: Task[] = tasksSnapshot.docs.map((doc) => {
      const data = doc.data() as Omit<Task, "id">;
      return { id: doc.id, ...data };
    });

    return { tasks, error: null };
  } catch (error: any) {
    return { tasks: [], error: error.message };
  }
};

export const addTask = async (title: string, description: string, reminder?: string, tags?: string[]): Promise<{ success: boolean; error: string | null }> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    const taskRef = collection(doc(collection(db, "users"), user.uid), "tasks");
    await addDoc(taskRef, {
      title,
      description,
      timestamp: serverTimestamp(),
      reminder: reminder || null,
      tags: tags || [],
      isCompleted: false,
    });

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};