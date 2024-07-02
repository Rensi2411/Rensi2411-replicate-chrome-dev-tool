import { useState, useEffect, useCallback, useRef } from "react";

function useCustomNetworkRequests() {
  const [customRequests, setCustomRequests] = useState([]);
  const isIntercepting = useRef(false);

  const addCustomRequest = useCallback((customRequest) => {
    setCustomRequests((prev) => [...prev, customRequest]);
  }, []);

  const updateCustomRequest = useCallback((id, updates) => {
    setCustomRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, ...updates } : req))
    );
  }, []);

  const sendCustomRequest = useCallback(
    async (customUrl, customMethod = "GET", customBody = null) => {
      const customRequest = {
        id: Date.now(),
        customUrl,
        customMethod,
        customBody,
        startTime: performance.now(),
        type: getCustomRequestType(customUrl),
      };

      addCustomRequest(customRequest);

      try {
        isIntercepting.current = true;
        const options = {
          customMethod,
          headers: {
            "Content-Type": "application/json",
          },
        };

        if (customBody) {
          options.body = JSON.stringify(customBody);
        }

        const response = await fetch(customUrl, options);
        const responseBody = await response.text();
        let parsedResponseBody;
        try {
          parsedResponseBody = JSON.parse(responseBody);
        } catch {
          parsedResponseBody = responseBody;
        }

        updateCustomRequest(customRequest.id, {
          status: response.status,
          responseBody,
          endTime: performance.now(),
          ok: response.ok,
        });
      } catch (error) {
        updateCustomRequest(customRequest.id, {
          error: error.message,
          endTime: performance.now(),
          ok: false,
        });
      } finally {
        isIntercepting.current = false;
      }
    },
    [addCustomRequest, updateCustomRequest]
  );

  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      if (isIntercepting.current) {
        return originalFetch(...args);
      }

      const customUrl = typeof args[0] === "string" ? args[0] : args[0].customUrl;
      const customMethod = args[1]?.customMethod || "GET";

      const customRequest = {
        id: Date.now(),
        customUrl,
        customMethod,
        startTime: performance.now(),
        type: getCustomRequestType(customUrl),
      };

      addCustomRequest(customRequest);

      try {
        const response = await originalFetch(...args);
        const clone = response.clone();
        const responseBody = await clone.text();

        updateCustomRequest(customRequest.id, {
          status: response.status,
          responseBody,
          endTime: performance.now(),
        });

        return response;
      } catch (error) {
        updateCustomRequest(customRequest.id, {
          error: error.message,
          endTime: performance.now(),
        });
        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [addCustomRequest, updateCustomRequest]);

  return { customRequests, sendCustomRequest };
}

function getCustomRequestType(customUrl) {
  const extension = customUrl.split(".").pop().toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "svg"].includes(extension)) return "img";
  if (extension === "css") return "css";
  if (extension === "js") return "js";
  return "xhr";
}

export default useCustomNetworkRequests;
