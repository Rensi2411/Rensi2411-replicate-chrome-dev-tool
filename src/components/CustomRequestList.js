import React from "react";
import { List, ListItem, ListItemText, ListItemIcon, Typography } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";

import "../styles/RequestList.css"; 

function CustomRequestList({ customRequests, onCustomSelectRequest }) {
  return (
    <List className="custom-request-list">
      {customRequests.length === 0 ? (
        <Typography variant="body1" className="empty-list-message">
          No custom requests available
        </Typography>
      ) : (
        customRequests.map((customRequest) => (
          <ListItem
            key={customRequest.id}
            button
            onClick={() => onCustomSelectRequest(customRequest)}
            className="custom-list-item"
          >
            {!customRequest.ok && (
              <ListItemIcon>
                <ErrorIcon color="error" />
              </ListItemIcon>
            )}
            <ListItemText
              primary={customRequest.url}
              secondary={`${customRequest.method} - ${customRequest.status || "Pending"}`}
              style={{ 
                fontStyle: "italic",
              }}
            />
          </ListItem>
        ))
      )}
    </List>
  );
}

export default CustomRequestList;
