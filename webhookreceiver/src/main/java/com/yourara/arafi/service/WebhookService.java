package com.yourara.arafi.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yourara.arafi.model.WebhookEvent;
import com.yourara.arafi.repository.WebhookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WebhookService {

    private final WebhookRepository webhookRepo;
    private final ObjectMapper objectMapper;

    @Value("${arafi.nomba.signing.key}")
    private String signingKey;

    @Async
    public void handleWebhook(String rawPayload, String signature){
        try {
            System.out.println("Webhook Ingestion: Verifying signature and persisting payload...");
            Boolean isVerified = verifySignature(rawPayload, signature);

            System.out.println("isVerified Status: " + isVerified);
            Map<String, Object> payloadMap = objectMapper.readValue(rawPayload, new TypeReference<>() {});
            
            String nombaEventId = (String) payloadMap.get("requestId");
            if (nombaEventId == null) {
                Object dataObj = payloadMap.get("data");
                if (dataObj instanceof Map) {
                    Map dataMap = (Map) dataObj;
                    if (dataMap.get("transactionId") != null) {
                        nombaEventId = dataMap.get("transactionId").toString();
                    }
                }
            }
            if (nombaEventId == null) {
                nombaEventId = "nomba_evt_" + UUID.randomUUID().toString();
            }

            String eventType = (String) payloadMap.get("event_type");
            if (eventType == null) {
                eventType = "unknown";
            }

            WebhookEvent webhook = WebhookEvent.builder()
                    .nombaEventId(nombaEventId)
                    .eventType(eventType)
                    .rawPayload(payloadMap)
                    .isSignatureVerified(isVerified)
                    .processingStatus("received")
                    .build();

            webhookRepo.save(webhook);
            System.out.println("Webhook Ingestion: Saved event " + nombaEventId + " successfully.");
        } catch (JsonProcessingException e) {
            throw new RuntimeException("JSON parsing failure on webhook", e);
        }
    }

    private Boolean verifySignature(String rawPayload, String signature){
        if(signature == null || signingKey == null){
            return false;
        }
        try {
            Mac hmacSha256 = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(signingKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            hmacSha256.init(secretKey);

            byte[] rawHash = hmacSha256.doFinal(rawPayload.getBytes(StandardCharsets.UTF_8));
            String computedSignature = java.util.HexFormat.of().formatHex(rawHash);

            return MessageDigest.isEqual(computedSignature.toLowerCase().getBytes(StandardCharsets.UTF_8),
                    signature.toLowerCase().getBytes(StandardCharsets.UTF_8));
        } catch (Exception e) {
            return false;
        }
    }
}
