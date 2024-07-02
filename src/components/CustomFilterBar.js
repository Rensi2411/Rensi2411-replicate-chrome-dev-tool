import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  TextField,
  Select,
  MenuItem,
  Button,
  TextareaAutosize,
  Typography,
} from "@mui/material";

import "../styles/FilterBar.css";

function CustomFilterBar({
  customFilterType,
  setCustomFilterType,
  customSearchTerm,
  setCustomSearchTerm,
  onCustomSendRequest,
}) {
  const [customUrl, setCustomUrl] = useState("");
  const [customMethod, setCustomMethod] = useState("GET");
  const [customRequestBody, setCustomRequestBody] = useState("");
  const [customJsonError, setCustomJsonError] = useState("");
  const [customUrlError, setCustomUrlError] = useState("");

  const handleCustomSendRequest = () => {
    setCustomJsonError("");
    setCustomUrlError("");

    if (!customUrl.trim()) {
      setCustomUrlError("URL cannot be empty");
      return;
    }

    try {
      new URL(customUrl);
    } catch (error) {
      setCustomUrlError("Invalid URL format");
      return;
    }

    if (customMethod !== "GET" && customMethod !== "DELETE") {
      try {
        const parsedBody = JSON.parse(customRequestBody);
        onCustomSendRequest(customUrl, customMethod, parsedBody);
      } catch (error) {
        setCustomJsonError("Invalid JSON format");
        return;
      }
    } else {
      onCustomSendRequest(customUrl, customMethod, customRequestBody);
    }
    setCustomRequestBody("");
  };

  return (
    <AppBar position="static" color="default" className="custom-filterbar">
      <Toolbar className="custom-toolbar">
        <div className="filterbar-inputs">
          <TextField
            label="Custom Filter"
            variant="outlined"
            size="small"
            className="filterbar-input"
            value={customSearchTerm}
            onChange={(e) => setCustomSearchTerm(e.target.value)}
          />
          <Select
            value={customFilterType}
            size="small"
            onChange={(e) => setCustomFilterType(e.target.value)}
            className="filterbar-input"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="xhr">XHR</MenuItem>
            <MenuItem value="js">JS</MenuItem>
            <MenuItem value="css">CSS</MenuItem>
            <MenuItem value="img">Image</MenuItem>
          </Select>
        </div>
        <div className="filterbar-inputs">
          <TextField
            label="Custom URL"
            variant="outlined"
            size="small"
            value={customUrl}
            onChange={(e) => {
              setCustomUrl(e.target.value);
              setCustomUrlError("");
            }}
            error={!!customUrlError}
            helperText={customUrlError}
            className="filterbar-input"
          />
          <Select
            value={customMethod}
            size="small"
            onChange={(e) => setCustomMethod(e.target.value)}
            className="filterbar-input"
          >
            <MenuItem value="GET">GET</MenuItem>
            <MenuItem value="POST">POST</MenuItem>
            <MenuItem value="PUT">PUT</MenuItem>
            <MenuItem value="PATCH">PATCH</MenuItem>
            <MenuItem value="DELETE">DELETE</MenuItem>
          </Select>
          <Button variant="contained" onClick={handleCustomSendRequest}>
            Send
          </Button>
        </div>
        {(customMethod === "POST" || customMethod === "PUT" || customMethod === "PATCH") && (
          <>
            <TextareaAutosize
              minRows={3}
              placeholder="Custom Request Body (JSON)"
              value={customRequestBody}
              onChange={(e) => {
                setCustomRequestBody(e.target.value);
                setCustomJsonError("");
              }}
              className="custom-textarea"
            />
            {customJsonError && <Typography color="error">{customJsonError}</Typography>}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default CustomFilterBar;
