import * as React from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Modal,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "5px",
  width: 400,
  p: 3,
};

function ChildModal({ handleDelete, item, time, type }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <IconButton
        aria-label="delete"
        size="small"
        color="danger"
        onClick={handleOpen}
      >
        <DeleteIcon />
      </IconButton>{" "}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Do yon want to Delete this?
          </Typography>
          <Box
            sx={{
              border: "1px solid black",
              mb: 2,
              p: 1,
              borderRadius: "5px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {type === "Purchase History" ? (
                <>
                  <Typography>{item.ingredients}</Typography>
                  <Typography sx={{ mr: 1 }}>{item.cost}</Typography>
                </>
              ) : (
                <>
                  <Typography>{item.user}</Typography>
                  <Typography sx={{ mr: 1 }}>{item.amount}</Typography>
                </>
              )}
            </Box>
            <Typography>{time}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ flexGrow: 1 }}></Box>
            <Button
              onClick={handleClose}
              size="large"
              variant="outlined"
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
            <Button
              size="large"
              onClick={() => {
                handleDelete(item);
                handleClose();
              }}
              variant="contained"
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

export default ChildModal;
