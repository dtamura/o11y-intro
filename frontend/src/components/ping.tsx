"use client";

import { useState, useEffect } from "react";

import { Button, CircularProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";

export default function Ping() {
  const [msg, setMsg] = useState();
  const [loading, setLoading] = useState(false);

  // pingしてmsgに設定
  function handlePing() {
    setMsg(Object("connecting..."));
    setLoading(true);
    axios
      .get("http://localhost:8000/ping", {
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res);
        setMsg(res.data);
        setLoading(false);
      })
      .catch((error) => {
        setMsg(error.message);
        setLoading(false);
      });
  }

  return (
    <>
      <div>
        <Button variant="contained" onClick={handlePing} endIcon={<SendIcon />}>
          /ping
        </Button>
        {loading ? <CircularProgress /> : <pre>{JSON.stringify(msg, null, 2)}</pre>}
      </div>
    </>
  );
}
