import { useState, createContext } from "react";
import axios from "axios"; // ✅ remove curly braces

export const ShopContext = createContext(null);

const ShopContextProvide = (props) => {
  const [sites, setSites] = useState("");

  const addToBackEndSite = async () => {
    try {
      const response = await axios.post("http://localhost:4000/sites", {
        siteName: sites, // 👈 sending dynamic site value
      });
      console.log("Response from backend:", response.data);
    } catch (error) {
      console.error("Error sending to backend:", error);
    }
  };

  const contextValue = {
    setSites,
    sites,
    addToBackEndSite, // 👈 expose function
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvide;
