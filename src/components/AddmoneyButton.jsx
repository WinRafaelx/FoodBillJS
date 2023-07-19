import { Box, Typography, Button, TextField, Modal, FormControl, MenuItem, InputLabel, Select } from "@mui/material";
import { useState } from "react";
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

function AddmoneyButton() {
  const [money, setMoney] = useState("");
  const [user, setUser] = useState("");
  const [Detail, setDetail] = useState("");
  const [warning, setWarning] = useState("");

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (event) => {
    setUser(event.target.value);
  };

  const clearVal = () => {
    setMoney("");
    setUser("");
    setDetail("");
    setWarning("");
  };

  const handleRefill = async () => {
    if (parseInt(money) <= 0 || user === "" || Detail === "") {
      setWarning("Please fill in the blank");
      return;
    }
    const docRef = await addDoc(collection(db, "AddMoney History"), {
      amount: parseInt(money),
      user: user,
      Detail: Detail,
      timestamp: serverTimestamp(),
    });
    await runTransaction(db, async (t) => {
      const docTran = doc(db, "Balance", "Balance");
      const tran = await t.get(docTran);
      const newBalance = tran.data().Balance + parseInt(money);
      t.update(docTran, { Balance: newBalance });
    });
    clearVal()
  };

  return (
    <>
      <Button
        variant="contained"
        color="warning"
        sx={{ mr: 1 }}
        onClick={handleOpen}
        size='large'
      >
        Add Money
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Add to Central Budget
          </Typography>
          <Box sx={{ mt: 2 }}>
            <TextField
              value={money}
              placeholder="99"
              name="Money"
              label="How Much?"
              required
              fullWidth
              type="number"
              onChange={(e) => setMoney(e.target.value)}
            ></TextField>
            <TextField
              value={Detail}
              margin="normal"
              required
              name="What is it?"
              label="What is it?"
              placeholder="Central Budget, Neko Food ..."
              fullWidth
              type="text"
              autoComplete="current-password"
              onChange={(e) => setDetail(e.target.value)}
            />
            <FormControl variant="outlined" fullWidth sx={{my:1}}>
              <InputLabel>Who?</InputLabel>
              <Select
                value={user}
                onChange={handleChange}
              >
                <MenuItem value={"Win"}>Win</MenuItem>
                <MenuItem value={"Kim"}>Kim</MenuItem>
              </Select>
            </FormControl>
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
                color="warning"
              >
                End Task
              </Button>
              <Button
                variant="contained"
                sx={{ width: "50%", ml: 0.5 }}
                onClick={handleRefill}
                size="large"
                color="warning"
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

export default AddmoneyButton;
