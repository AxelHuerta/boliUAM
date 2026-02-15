import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase";
import { useUeaStore } from "../store/ueas-store";
import type { Register } from "../store/ueas-store";

export function useFirestoreSync() {
  const { user } = useAuth();
  const { ueas, setUeas } = useUeaStore();
  const [isSynced, setIsSynced] = useState(false);

  // Effect to sync FROM Firestore on login
  useEffect(() => {
    async function syncFromFirestore() {
      if (!user) {
        setIsSynced(false);
        return;
      }

      try {
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.ueas && Array.isArray(data.ueas)) {
             setUeas(data.ueas as Register[]);
          }
        } else {
            // New user in firestore, upload local if there is any
            if (ueas.length > 0) {
                await setDoc(userDocRef, { ueas });
            }
        }
        setIsSynced(true);
      } catch (error) {
        console.error("Error syncing from Firestore:", error);
      }
    }

    syncFromFirestore();
  }, [user]);

  // Effect to sync TO Firestore on changes
  useEffect(() => {
      if (!user || !isSynced) return;
      
      const syncToFirestore = async () => {
          try {
             const userDocRef = doc(db, "users", user.uid);
             await setDoc(userDocRef, { ueas }, { merge: true });
          } catch (error) {
              console.error("Error syncing to Firestore:", error);
          }
      };
      
      const timeoutId = setTimeout(() => {
          syncToFirestore();
      }, 1000); 

      return () => clearTimeout(timeoutId);

  }, [ueas, user, isSynced]); 
}
