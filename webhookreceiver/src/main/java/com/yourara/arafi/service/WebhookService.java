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

@Service
@RequiredArgsConstructor
public class WebhookService {

    private final WebhookRepository webhookRepo;
    private final ObjectMapper objectMapper;

    @Value("${arafi.nomba.signing.key}")
    private String signingKey;

    // PROCESS RECEIVING A WEBHOOK
    // controller layer would handle the check to find out if this request is from nomba
    @Async
    public void handleWebhook(String rawPayload, String signature){

        try {

            System.out.println("Inside service layer");
            // verify the signature
            Boolean isVerified = verifySignature(rawPayload, signature);

            System.out.println("isVerified Status: " +isVerified);
            Map<String, Object> payloadMap = objectMapper.readValue(rawPayload, new TypeReference<>() {});
            // Map webhook to DB entity
            WebhookEvent webhook = WebhookEvent.builder()
                    .nombaEventId((String) payloadMap.get("requestId"))
                    .eventType((String) payloadMap.get("event_type"))
                    .rawPayload(payloadMap)
                    .isSignatureVerified(isVerified)
                    .processingStatus("received")
                    .build();
            // save the raw payload from Nomba to the db
            webhookRepo.save(webhook);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
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
            String computedSignature = Base64.getEncoder().encodeToString(rawHash);

            // Use constant-time comparison to prevent timing-attack exploits
            return MessageDigest.isEqual(computedSignature.getBytes(StandardCharsets.UTF_8),
                    signature.getBytes(StandardCharsets.UTF_8));
        } catch (Exception e) {
            return false;
        }
    }

}
