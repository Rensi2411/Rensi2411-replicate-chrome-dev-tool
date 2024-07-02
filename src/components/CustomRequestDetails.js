import React from "react";
import {
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import "../styles/RequestDetails.css";

function CustomRequestDetails({ customRequest }) {
  if (!customRequest)
    return (
      <Typography variant="body1" className="empty-message">
        Select a request to view details
      </Typography>
    );
  const formatCustomJSON = (data) => {
    if (typeof data === "string") {
      try {
        return JSON.stringify(JSON.parse(data), null, 2);
      } catch {
        return data;
      }
    }
    return JSON.stringify(data, null, 2);
  };

  return (
    <Box className="custom-request-details">
      <Typography variant="h6">Custom Request Details</Typography>
      <Typography>URL: {customRequest.url}</Typography>
      <Typography>Method: {customRequest.method}</Typography>
      <Typography>Status: {customRequest.status || "Pending"}</Typography>
      <Typography>Start Time: {customRequest.startTime.toFixed(2)} ms</Typography>
      <Typography>
        End Time:{" "}
        {customRequest.endTime ? customRequest.endTime.toFixed(2) + " ms" : "Pending"}
      </Typography>
      <Typography>
        Duration:{" "}
        {customRequest.endTime
          ? (customRequest.endTime - customRequest.startTime).toFixed(2) + " ms"
          : "Pending"}
      </Typography>

      {customRequest.body && (
        <Accordion className="custom-accordion">
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Custom Request Body (JSON)</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <pre className="custom-pre">
              {formatCustomJSON(customRequest.body)}
            </pre>
          </AccordionDetails>
        </Accordion>
      )}

      {customRequest.responseBody && (
        <Accordion className="custom-accordion">
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Response Body</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <pre className="custom-pre">
              {formatCustomJSON(customRequest.responseBody)}
            </pre>
          </AccordionDetails>
        </Accordion>
      )}

      {!customRequest.ok && (
        <Typography color="error">
          Error: {customRequest.error || `HTTP Error ${customRequest.status}`}
        </Typography>
      )}
    </Box>
  );
}

export default CustomRequestDetails;
