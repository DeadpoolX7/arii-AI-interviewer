import { db } from "./firebase"
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"
import type { InterviewSession, UserProfile } from "@/types/interview"

// Utility function to check if error is due to blocked request
const isRequestBlocked = (error: any) => {
  return error.code === 'failed-precondition' || 
         error.message?.includes('blocked by client') ||
         error.name === 'FirebaseError'
}

// Retry logic for Firestore operations
const retry = async (operation: () => Promise<any>, maxAttempts = 3) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation()
    } catch (error: any) {
      if (attempt === maxAttempts || !isRequestBlocked(error)) {
        throw error
      }
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
    }
  }
}

// Interview Sessions
// Add this helper function at the top
const generateLocalId = () => {
  return 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

export const createInterviewSession = async (sessionData: Omit<InterviewSession, "sessionId" | "createdAt">) => {
  try {
    const docRef = await retry(async () => 
      addDoc(collection(db, "interviews"), {
        ...sessionData,
        createdAt: serverTimestamp(),
      })
    )
    return { sessionId: docRef.id, error: null }
  } catch (error: any) {
    if (isRequestBlocked(error)) {
      // Create a local session when Firestore is blocked
      const localSessionId = generateLocalId();
      const localSession = {
        ...sessionData,
        sessionId: localSessionId,
        createdAt: new Date().toISOString(),
      };
      
      // Store in localStorage
      try {
        const existingSessions = JSON.parse(localStorage.getItem('localInterviews') || '[]');
        existingSessions.push(localSession);
        localStorage.setItem('localInterviews', JSON.stringify(existingSessions));
        
        return { 
          sessionId: localSessionId, 
          error: null,
          isLocal: true // Flag to indicate this is a local session
        }
      } catch (localError) {
        return { 
          sessionId: null, 
          error: "Unable to save interview data. Please try again." 
        }
      }
    }
    return { sessionId: null, error: error.message }
  }
}

export const getInterviewSession = async (sessionId: string) => {
  try {
    const docRef = doc(db, "interviews", sessionId)
    const docSnap = await retry(() => getDoc(docRef))

    if (docSnap.exists()) {
      return {
        session: { sessionId, ...docSnap.data() } as InterviewSession,
        error: null,
      }
    } else {
      return { session: null, error: "Session not found" }
    }
  } catch (error: any) {
    if (isRequestBlocked(error)) {
      return { 
        session: null, 
        error: "Unable to load data. Please disable ad blockers or privacy extensions for this site." 
      }
    }
    return { session: null, error: error.message }
  }
}

export const updateInterviewSession = async (sessionId: string, updates: Partial<InterviewSession>) => {
  try {
    const docRef = doc(db, "interviews", sessionId)
    await retry(() => updateDoc(docRef, updates))
    return { error: null }
  } catch (error: any) {
    if (isRequestBlocked(error)) {
      return { 
        error: "Unable to update data. Please disable ad blockers or privacy extensions for this site." 
      }
    }
    return { error: error.message }
  }
}

export const getUserInterviews = async (userId: string) => {
  try {
    const q = query(
      collection(db, "interviews"), 
      where("userId", "==", userId), 
      orderBy("createdAt", "desc")
    )
    const querySnapshot = await retry(() => getDocs(q))
    const interviews: InterviewSession[] = []

    querySnapshot.forEach((doc) => {
      interviews.push({ sessionId: doc.id, ...doc.data() } as InterviewSession)
    })

    return { interviews, error: null }
  } catch (error: any) {
    if (isRequestBlocked(error)) {
      return { 
        interviews: [], 
        error: "Unable to load interviews. Please disable ad blockers or privacy extensions for this site." 
      }
    }
    return { interviews: [], error: error.message }
  }
}

// User Profiles
export const createUserProfile = async (profileData: UserProfile) => {
  try {
    await addDoc(collection(db, "users"), {
      ...profileData,
      createdAt: serverTimestamp(),
    })
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

export const getUserProfile = async (uid: string) => {
  try {
    const q = query(collection(db, "users"), where("uid", "==", uid))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]
      return {
        profile: { id: doc.id, ...doc.data() } as UserProfile,
        error: null,
      }
    } else {
      return { profile: null, error: "Profile not found" }
    }
  } catch (error: any) {
    return { profile: null, error: error.message }
  }
}
