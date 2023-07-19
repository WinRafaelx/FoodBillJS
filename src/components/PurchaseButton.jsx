import { useState } from "react";
import { Box, Typography, Button, TextField, Modal } from "@mui/material";
import {
  doc,
  addDoc,
  collection,
  serverTimestamp,
  runTransaction,
} from "firebase/firestore";
import { db } from "../firebase/firebase.js";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

function PurchaseButton() {
  const [cost, setCost] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [warning, setWarning] = useState("");

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const clearVal = () => {
    setCost("");
    setIngredients("");
    setWarning("");
  };
  const handlePurchase = async () => {
    if (parseInt(cost) <= 0 || ingredients === "") {
      setWarning("Please fill in the blank");
      return;
    }
    const docRef = await addDoc(collection(db, "Purchase History"), {
      cost: parseInt(cost),
      ingredients: ingredients,
      timestamp: serverTimestamp(),
    });
    try {
      await runTransaction(db, async (t) => {
        const docTran = doc(db, "Balance", "Balance");
        const tran = await t.get(docTran);
        const newBalance = tran.data().Balance - parseInt(cost);
        t.update(docTran, { Balance: newBalance });
      });
    } catch (e) {
      console.log(e);
    }
    clearVal();
  };
  return (
    <>
      <Button variant="contained" color="error" onClick={handleOpen} size="large">
        Purchase
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Purchase Detail
          </Typography>
          <Box sx={{ mt: 2 }}>
            <TextField
              value={cost}
              placeholder="99"
              name="Price"
              label="Price"
              required
              fullWidth
              type="number"
              onChange={(e) => setCost(e.target.value)}
            ></TextField>
            <TextField
              value={ingredients}
              margin="normal"
              required
              name="What is it?"
              label="What is it?"
              placeholder="Neko, Inu ..."
              fullWidth
              type="text"
              autoComplete="current-password"
              onChange={(e) => setIngredients(e.target.value)}
            />
            <Typography variant="inherit" sx={{ color: "red" }}>
              {warning}
            </Typography>
            <Box
              sx={{ mt: 1, mx: "auto" }}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Button
                variant="outlined"
                sx={{ width: "50%", mr: 0.56 }}
                onClick={handleClose}
                size="large"
                color="error"
              >
                End Task
              </Button>
              <Button
                variant="contained"
                sx={{ width: "50%", ml: 0.5 }}
                onClick={handlePurchase}
                size="large"
                color="error"
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default PurchaseButton;
