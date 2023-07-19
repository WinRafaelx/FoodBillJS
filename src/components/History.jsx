import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Modal,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
} from "@mui/material";
import { db } from "../firebase/firebase.js";
import { query, orderBy, collection, getDocs, doc, deleteDoc, runTransaction } from "firebase/firestore";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "5px",
};

function convertToDateTime(time) {
  // Convert nanoseconds to milliseconds
  const milliseconds = time.nanoseconds / 1e6;

  // Create a new Date object with the provided seconds and milliseconds
  const date = new Date(time.seconds * 1000 + milliseconds);

  // Extract day, month, year, hour, and minute from the Date object
  const day = date.getDate();
  const month = date.getMonth() + 1; // January is 0, so add 1 to get the correct month
  const year = date.getFullYear();
  const hour = date.getHours();
  let minute = date.getMinutes();
  if (minute < 10) {
    minute = "0" + minute;
  }

  // Return the formatted result
  return `${day} / ${month} / ${year} ${hour}:${minute}`;
}

function History() {
  const [purchase, setPurchase] = useState([]);
  const [addmoney, setAddmoney] = useState([]);
  const [show, setShow] = useState("Purchase History");

  const PurchaseHis = query(
    collection(db, "Purchase History"),
    orderBy("timestamp", "desc")
  );
  const AddMoneyHis = query(
    collection(db, "AddMoney History"),
    orderBy("timestamp", "desc")
  );

  const FetchPurchase = async () => {
    await getDocs(PurchaseHis).then((querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setPurchase(data);
    });
  };

  const FetchCentral = async () => {
    await getDocs(AddMoneyHis).then((querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setAddmoney(data);
    });
  };

  const handleDelete = async (item) => {
    let val;
    show === "Purchase History" ?  val = item.cost : val = -item.amount;
    await runTransaction(db, async (t) => {
      const docTran = doc(db, "Balance", "Balance");
      const tran = await t.get(docTran);
      const newBalance = tran.data().Balance + parseInt(val);
      t.update(docTran, { Balance: newBalance });
    });
    await deleteDoc(doc(db, show, item.id));
    FetchPurchase();
    FetchCentral();
  };

  
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
    FetchPurchase();
    FetchCentral();
  };
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button variant="contained" fullWidth size="large" onClick={handleOpen}>
        History
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <ToggleButtonGroup
              color="primary"
              value={show}
              exclusive
              onChange={(e) => setShow(e.target.value)}
              aria-label="Platform"
            >
              <ToggleButton value="Purchase History">Purchase</ToggleButton>
              <ToggleButton value="AddMoney History">Add Budget</ToggleButton>
            </ToggleButtonGroup>
            <IconButton size="large" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          {show === "Purchase History" ? (
            <>
              {purchase.map((item) => (
                <Box
                  sx={{
                    border: "1px solid black",
                    mb: 1,
                    p: 1,
                    borderRadius: "5px",
                  }}
                  key={item.id}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography>{item.ingredients}</Typography>
                    <Typography sx={{mr:1}}>{item.cost}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <Typography>{convertToDateTime(item.timestamp)}</Typography>
                    <IconButton aria-label="delete" size="small" color="warning"
                    onClick={() => handleDelete(item)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </>
          ) : (
            <>
              {addmoney.map((item) => (
                <Box
                sx={{
                  border: "1px solid black",
                  mb: 1,
                  p: 1,
                  borderRadius: "5px",
                }}
                key={item.id}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography>{item.user}</Typography>
                  <Typography sx={{mr:1}}>{item.amount}</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <Typography>{convertToDateTime(item.timestamp)}</Typography>
                  <IconButton aria-label="delete" size="small" color="warning"
                  onClick={() => handleDelete(item)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
              ))}
            </>
          )}
        </Box>
      </Modal>
    </>
  );
}

export default History;
