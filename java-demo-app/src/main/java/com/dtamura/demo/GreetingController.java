package com.dtamura.demo;

import java.util.concurrent.atomic.AtomicLong;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// TODO (Trace) import文を追加ここから
import io.opentelemetry.instrumentation.annotations.WithSpan;
import io.opentelemetry.instrumentation.annotations.SpanAttribute;
import io.opentelemetry.api.trace.Span;
// ここまで

@RestController
public class GreetingController {

    private static final String template = "Hello, %s!";
    private final AtomicLong counter = new AtomicLong();

    private final Logger logger = LogManager.getLogger(GreetingController.class.getName());

    // TODO (Trace) Tracerプライベート変数を追加

    // TODO (Trace) コンストラクタの引数にOpenTelemetryを追加
    // TODO (Trace) コンストラクタ内でtracer変数を初期化
    public GreetingController() {
    }

    @WithSpan
    @GetMapping("/greeting")
    public Greeting greeting(@RequestParam(value = "name", defaultValue = "World") @SpanAttribute("name") String name) {

        // TODO (Trace) スパンの参照コードを追加
        Span span = Span.current();
        logger.info("start greeting");

        hoge();
        // TODO (Trace) スパンの終了コードを追加

        logger.info("end greeting");

        // TODO (Trace) GreetingオブジェクトにTraceIdを渡す
        return new Greeting(counter.incrementAndGet(), String.format(template, name), span.getSpanContext().getTraceId());
    }

    @WithSpan
    public void hoge() {
        // TODO (Trace) スパンの開始コードを追加

        logger.info("hoge");
        // TODO (Trace) スパンの終了コードを追加

    }
}
