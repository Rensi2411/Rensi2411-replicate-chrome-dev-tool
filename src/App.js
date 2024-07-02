import React, { useState, useMemo } from "react";
import { Container, Grid, Paper } from "@mui/material";
import CustomRequestList from "./components/CustomRequestList";
import CustomRequestDetails from "./components/CustomRequestDetails";
import CustomFilterBar from "./components/CustomFilterBar";
import useCustomNetworkRequests from "./hooks/useCustomNetworkRequests";
import "./App.css";

function CustomApp() {
  const [selectedCustomRequest, setSelectedCustomRequest] = useState(null);
  const [customFilterType, setCustomFilterType] = useState("all");
  const [customSearchTerm, setCustomSearchTerm] = useState("");
  const { customRequests, sendCustomRequest } = useCustomNetworkRequests();

  const filteredCustomRequests = useMemo(() => {
    return customRequests.filter((customRequest) => {
      const matchesType =
        customFilterType === "all" || customRequest.type === customFilterType;
      const matchesSearch = customRequest.customUrl
        .toLowerCase()
        .includes(customSearchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [customRequests, customFilterType, customSearchTerm]);

  const handleCustomSendRequest = (customUrl, customMethod, customBody) => {
    sendCustomRequest(customUrl, customMethod, customBody);
  };

  return (
    <Container maxWidth="xl">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <CustomFilterBar
            customFilterType={customFilterType}
            setCustomFilterType={setCustomFilterType}
            customSearchTerm={customSearchTerm}
            setCustomSearchTerm={setCustomSearchTerm}
            onCustomSendRequest={handleCustomSendRequest}
          />
        </Grid>
        <Grid item xs={4}>
          <Paper>
            <CustomRequestList
              customRequests={filteredCustomRequests}
              onCustomSelectRequest={setSelectedCustomRequest}
            />
          </Paper>
        </Grid>
        <Grid item xs={8}>
          <Paper>
            <CustomRequestDetails customRequest={selectedCustomRequest} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CustomApp;
