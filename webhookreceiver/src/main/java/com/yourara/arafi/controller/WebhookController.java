package com.yourara.arafi.controller;

import com.yourara.arafi.service.WebhookService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/webhook")
public class WebhookController {

    private final WebhookService webhookService;

    @PostMapping("/nomba")
    public ResponseEntity<Void> handleWebhook(
            @RequestHeader(value = "nomba-signature", required = false) String signature,
            @RequestHeader(value = "nomba-sig-value", required = false) String sigValue,
            @RequestHeader(value = "nomba-timestamp", required = false) String nombaTimestamp,
            @RequestHeader(value = "nomba-signature-algorithm", required = false) String sigAlgorithm,
            @RequestHeader(value = "nomba-signature-version", required = false) String sigVersion,
            @RequestBody String rawPayload) {
        // Nomba sends the same value in both nomba-signature and nomba-sig-value —
        // accept either
        String effectiveSignature = signature != null ? signature : sigValue;

        log.info("=== NOMBA WEBHOOK RECEIVED ===");
        log.info("nomba-signature present    : {}", signature != null ? "YES [" + signature + "]" : "MISSING");
        log.info("nomba-sig-value present    : {}", sigValue != null ? "YES [" + sigValue + "]" : "MISSING");
        log.info("nomba-timestamp            : {}", nombaTimestamp != null ? nombaTimestamp : "MISSING");
        log.info("nomba-signature-algorithm  : {}", sigAlgorithm != null ? sigAlgorithm : "MISSING");
        log.info("nomba-signature-version    : {}", sigVersion != null ? sigVersion : "MISSING");
        log.info("Payload size               : {} bytes", rawPayload != null ? rawPayload.length() : 0);
        log.info("Payload preview            : {}",
                rawPayload != null && rawPayload.length() > 400
                        ? rawPayload.substring(0, 400) + "..."
                        : rawPayload);

        try {
            webhookService.handleWebhook(rawPayload, effectiveSignature, nombaTimestamp);
            log.info("Webhook ingestion succeeded — returning 200");
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Webhook ingestion FAILED — returning 500 so Nomba retries. Reason: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }
}
