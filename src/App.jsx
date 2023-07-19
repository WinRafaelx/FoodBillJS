import { Box } from "@mui/material";
import Balance from "./components/Balance";
import PurchaseButton from "./components/PurchaseButton";
import AddmoneyButton from "./components/AddmoneyButton";
import History from "./components/History";

function App() {
  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Balance />
        <Box>
          <Box sx={{ mb: 2 }}>
            <AddmoneyButton />
            <PurchaseButton />
          </Box>
          <History />
        </Box>
      </Box>
    </>
  );
}

export default App;
