"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useUser } from "@clerk/nextjs";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { IUserInfo } from "@/types/user";
import { BeatLoader } from "react-spinners";
import { UserInfo } from "os";
// import type { User } from '@clerk/nextjs/server';

interface Props {
  children: ReactNode;
}

interface AuthContextType {
  userInfo: IUserInfo | null;
  updateUserInfo: (newUserInfo: IUserInfo) => void;
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

  const updateUserInfo = (newUserInfo: IUserInfo): void =>
    setUserInfo(newUserInfo);

  useEffect(() => {
    fetchUserInfo();
  }, [user, isLoaded, isSignedIn]);

  return (
    <AuthContext.Provider value={{ userInfo, updateUserInfo, isSignedIn }}>
      {children}
      {/* {isLoaded ? (
      children
      ) : (
        <div className="flex h-96 w-screen items-center justify-center">
          <BeatLoader color="#fff" size={50} />
        </div>
      )} */}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
