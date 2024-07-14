"use client";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import Greeting from "../components/greeting";
import Ping from "../components/ping";
import Link from "next/link";

export default function Home() {
  return (
    <Container>

      <div>
        <Typography variant="h3" component="h3">
          可観測性入門ハンズオン
        </Typography>

        <hr />

        <Typography variant="h4" component="h4">
          Javaコースの方用
        </Typography>
        <p>
          ボタンを押下すると、GET /greetingリクエストをJavaコンテナへ送信します
        </p>
        <Greeting />

        <hr />

        <Typography variant="h4" component="h4">
          Go言語コースの方用
        </Typography>
        <p>
          ボタンを押下すると、GET /pingリクエストをGoコンテナへ送信します
        </p>
        <Ping />

        <hr />

      </div>
    </Container>
  );
}
