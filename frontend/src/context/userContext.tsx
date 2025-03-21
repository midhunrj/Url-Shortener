 import { createContext, ReactNode, useContext, useEffect, useState } from "react";

// import { ReactNode, useContext, useEffect, useState } from "react";
// import { createContext } from "vm";

interface User {
  _id: string;
  email: string;
  username: string;
  password:string
}
interface AuthContextType {
  userAuthenticated: boolean;
  setUserAuthenticated: (value: boolean) => void;
  user:User|null,
  setUser:(user:User|null)=>void
}


const UserContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
        try {
          const userData = localStorage.getItem("urlUserData");
          return userData ? JSON.parse(userData) : null;
        } catch (error) {
          console.error("Error parsing userData from localStorage", error);
          return null;
        }
      });
    const [userAuthenticated, setUserAuthenticated] = useState<boolean>(() => {
        try {
            const userData = localStorage.getItem("urlUserData");
            return userData ? JSON.parse(userData) : false;
          } catch (error) {
            console.error("Error parsing userData from localStorage", error);
            return false;
          }
        });
        useEffect(() => {
              if (user) {
                localStorage.setItem("urlUserData", JSON.stringify(user));
              } else {
                localStorage.removeItem("urlUserData");
              }
              setUserAuthenticated(!!user);
            }, [user]);
      // useEffect(() => {
      //   localStorage.setItem("urlUserData", JSON.stringify(userAuthenticated));
      // }, [userAuthenticated]);

  return (
    <UserContext.Provider
      value={{
        userAuthenticated,
        setUserAuthenticated,
        user,
        setUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};


export default UserProvider;

// interface User {
//   id: string;
//   email: string;
//   name: string;
// }

// interface AuthContextType {
//   user: User | null;
//   setUser: (user: User | null) => void;
//   userAuthenticated: boolean;
//   setUserAuthenticated: (value: boolean) => void;
// }
// const UserContext = createContext<AuthContextType>({} as AuthContextType);
// export const useAuthContext = () => {
//   const context = useContext(UserContext);
//   if (!context) {
//     throw new Error("useAuthContext must be used within an AuthProvider");
//   }
//   return context;
// };
// export const UserProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(() => {
//     try {
//       const userData = localStorage.getItem("urlUserData");
//       return userData ? JSON.parse(userData) : null;
//     } catch (error) {
//       console.error("Error parsing userData from localStorage", error);
//       return null;
//     }
//   });

//   const [userAuthenticated, setUserAuthenticated] = useState<boolean>(!!user);

//   useEffect(() => {
//     if (user) {
//       localStorage.setItem("urlUserData", JSON.stringify(user));
//     } else {
//       localStorage.removeItem("urlUserData");
//     }
//     setUserAuthenticated(!!user);
//   }, [user]);

//   return (
//     <UserContext.Provider value={{ user, setUser, userAuthenticated, setUserAuthenticated }}>
//       {children}
//     </UserContext.Provider>
//   );
// };
