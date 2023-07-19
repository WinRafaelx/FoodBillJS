import React, { useEffect } from "react";
import { db } from "../firebase/firebase";
import { Typography } from "@mui/material";
import {
  query,
  doc,
  collection,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

function Balance() {
  const [Balance, setBalance] = React.useState(0);
  const FetchData = () => onSnapshot(doc(db, "Balance", "Balance"), (doc) =>
    setBalance(doc.data().Balance)
  );

  useEffect(() => {
    FetchData();
  }, []);
  
  return (
    <>
      <Typography variant="h1" sx={{mb:2}}>{Balance}</Typography>
    </>
  );
}

export default Balance;
