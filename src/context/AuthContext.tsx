"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { User, useUser } from "@clerk/nextjs";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { IUserInfo } from "@/types/user";

interface Props {
  children: ReactNode;
}

interface AuthContextType {
  user: User;
  userInfo: IUserInfo | null;
  isLoaded: boolean;
  isSignedIn: boolean | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);

  const fetchUserInfo = async () => {
    if (isLoaded && isSignedIn) {
      const userDocRef = doc(db, "users", user.id);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setUserInfo({
          id: userDoc.data().id,
          email: userDoc.data().email,
          firstName: userDoc.data().firstName,
          lastName: userDoc.data().lastName,
          createdAt: userDoc.data().createdAt,
          plan: userDoc.data().plan,
          planActive: userDoc.data().planActive,
          planStartDate: userDoc.data().planStartDate,
          flashcardSets: userDoc.data().flashcardSets,
        });
      } else {
        // If user does not exist in Firestore, create a new document
        const newUser: IUserInfo = {
          id: user.id,
          email: user.emailAddresses[0].emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt,
          plan: "free",
          planActive: false,
          planStartDate: new Date(),
          flashcardSets: [],
        };

        await setDoc(userDocRef, newUser);
        setUserInfo(newUser);
      }
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [user, isLoaded, isSignedIn]);

  return (
    <AuthContext.Provider value={{ user, userInfo, isLoaded, isSignedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
