package com.yourara.arafi.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yourara.arafi.model.WebhookEvent;
import com.yourara.arafi.repository.WebhookRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class WebhookService {

    private final WebhookRepository webhookRepo;
    private final ObjectMapper objectMapper;

    @Value("${arafi.nomba.signing.key}")
    private String signingKey;

    /**
     * Ingests a raw Nomba webhook. This method is intentionally synchronous —
     * errors must propagate to the controller so Nomba receives a 5xx and retries.
     *
     * @param rawPayload     the raw JSON body string from Nomba
     * @param signature      the nomba-signature (or nomba-sig-value) header
     * @param nombaTimestamp the nomba-timestamp header — REQUIRED for signature construction
     */
    public void handleWebhook(String rawPayload, String signature, String nombaTimestamp) {
        log.info("WebhookService.handleWebhook() — starting ingestion");

        Map<String, Object> payloadMap;
        try {
            payloadMap = objectMapper.readValue(rawPayload, new TypeReference<>() {});
            log.info("JSON parsed successfully. Top-level keys: {}", payloadMap.keySet());
        } catch (JsonProcessingException e) {
            log.error("JSON parsing FAILED. Cannot proceed. Raw payload was: {}", rawPayload);
            throw new RuntimeException("JSON parsing failure on webhook payload", e);
        }

        // --- Signature Verification ---
        // Per Nomba's official docs, the signature is computed over a constructed string:
        //   event_type:requestId:userId:walletId:transactionId:type:time:responseCode:nomba-timestamp
        // NOT over the raw body. The nomba-timestamp value comes from the request header.
        Boolean isVerified = verifySignature(payloadMap, signature, nombaTimestamp);
        log.info("Signature verification result: {}",
                isVerified ? "VERIFIED ✓" : "NOT VERIFIED (saved anyway for inspection)");

        // --- Extract requestId ---
        String nombaEventId = (String) payloadMap.get("requestId");
        if (nombaEventId == null) {
            nombaEventId = "nomba_evt_" + UUID.randomUUID();
            log.warn("No requestId in payload — generated fallback ID: {}", nombaEventId);
        } else {
            log.info("requestId: {}", nombaEventId);
        }

        // --- Extract event_type ---
        String eventType = (String) payloadMap.get("event_type");
        if (eventType == null) {
            eventType = "unknown";
            log.warn("No event_type field found in payload. Keys present: {}", payloadMap.keySet());
        } else {
            log.info("event_type: {}", eventType);
        }

        // --- Persist ---
        WebhookEvent webhook = WebhookEvent.builder()
                .nombaEventId(nombaEventId)
                .eventType(eventType)
                .rawPayload(payloadMap)
                .isSignatureVerified(isVerified)
                .processingStatus("received")
                .build();

        webhookRepo.save(webhook);
        log.info("Webhook persisted to DB — id={}, eventType={}, signatureVerified={}",
                nombaEventId, eventType, isVerified);
    }

    /**
     * Reconstructs the Nomba HMAC signature following the official specification.
     *
     * Nomba computes:
     *   HMAC-SHA256( "{event_type}:{requestId}:{userId}:{walletId}:{transactionId}:{type}:{time}:{responseCode}:{nomba-timestamp}", secret )
     * then Base64-encodes the result.
     *
     * Source: https://developer.nomba.com — Webhook Signature Verification
     */
    @SuppressWarnings("unchecked")
    private Boolean verifySignature(Map<String, Object> payloadMap, String signature, String nombaTimestamp) {
        if (signature == null || signature.isBlank()) {
            log.warn("verifySignature: nomba-signature header is NULL or empty — cannot verify");
            return false;
        }
        if (signingKey == null || signingKey.isBlank()) {
            log.warn("verifySignature: signing key not configured (arafi.nomba.signing.key) — cannot verify");
            return false;
        }
        if (nombaTimestamp == null || nombaTimestamp.isBlank()) {
            log.warn("verifySignature: nomba-timestamp header is MISSING — cannot construct signature payload");
            // Still attempt verification with empty timestamp so we get a useful mismatch log
            nombaTimestamp = "";
        }

        try {
            // Extract fields required by Nomba's signature construction
            String eventType    = safe(payloadMap.get("event_type"));
            String requestId    = safe(payloadMap.get("requestId"));

            Map<String, Object> data        = payloadMap.get("data") instanceof Map ? (Map<String, Object>) payloadMap.get("data") : Map.of();
            Map<String, Object> merchant    = data.get("merchant")    instanceof Map ? (Map<String, Object>) data.get("merchant")    : Map.of();
            Map<String, Object> transaction = data.get("transaction") instanceof Map ? (Map<String, Object>) data.get("transaction") : Map.of();

            String userId             = safe(merchant.get("userId"));
            String walletId           = safe(merchant.get("walletId"));
            String transactionId      = safe(transaction.get("transactionId"));
            String transactionType    = safe(transaction.get("type"));
            String transactionTime    = safe(transaction.get("time"));
            String responseCode       = safe(transaction.get("responseCode"));

            // Nomba doc: if responseCode is literally the string "null", treat as empty
            if ("null".equalsIgnoreCase(responseCode)) responseCode = "";

            // Construct the exact string Nomba signs
            String hashingPayload = String.format("%s:%s:%s:%s:%s:%s:%s:%s:%s",
                    eventType, requestId, userId, walletId,
                    transactionId, transactionType, transactionTime,
                    responseCode, nombaTimestamp);

            log.info("Signature construction string: [{}]", hashingPayload);

            // HMAC-SHA256 + Base64 (per official Nomba docs — all languages use Base64, not Hex)
            Mac hmacSha256 = Mac.getInstance("HmacSHA256");
            hmacSha256.init(new SecretKeySpec(signingKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] rawHash = hmacSha256.doFinal(hashingPayload.getBytes(StandardCharsets.UTF_8));
            String computedSignature = Base64.getEncoder().encodeToString(rawHash);

            log.info("Computed signature : [{}]", computedSignature);
            log.info("Received signature : [{}]", signature);

            boolean match = MessageDigest.isEqual(
                    computedSignature.getBytes(StandardCharsets.UTF_8),
                    signature.getBytes(StandardCharsets.UTF_8));

            if (!match) {
                log.warn("Signature MISMATCH — see computed vs received above. " +
                         "Check: (1) signing key matches Nomba dashboard, " +
                         "(2) nomba-timestamp header is being forwarded correctly.");
            } else {
                log.info("Signatures MATCH ✓");
            }

            return match;

        } catch (Exception e) {
            log.error("Signature verification threw an exception: {}", e.getMessage(), e);
            return false;
        }
    }

    private String safe(Object value) {
        if (value == null) return "";
        String str = value.toString().trim();
        return "null".equalsIgnoreCase(str) ? "" : str;
    }
}
