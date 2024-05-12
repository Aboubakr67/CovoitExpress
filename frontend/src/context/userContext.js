//  ! Ancien userContext

// import { createContext, useEffect, useState } from "react";

// export const UserContext = createContext();

// const UserProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(
//     JSON.parse(localStorage.getItem("user"))
//   );

//   useEffect(() => {
//     localStorage.setItem("user", JSON.stringify(currentUser));
//   }, [currentUser]);

//   return (
//     <UserContext.Provider value={{ currentUser, setCurrentUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export default UserProvider;

// ? ---------------------------------

import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || {}
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentUser(JSON.parse(localStorage.getItem("user")) || {});
    };

    // Écoute les changements dans le localStorage
    window.addEventListener("storage", handleStorageChange);

    return () => {
      // Retire l'écouteur lorsque le composant est démonté
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const updateUserInLocalStorage = (updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
  };

  return (
    <UserContext.Provider
      value={{ currentUser, setCurrentUser: updateUserInLocalStorage }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
