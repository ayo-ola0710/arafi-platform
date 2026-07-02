package com.yourara.arafi.controller;

import com.yourara.arafi.service.WebhookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/webhook")
public class WebhookController {

    private final WebhookService webhookService;

    @PostMapping("/nomba")
    public ResponseEntity<Void> handleWebhook(
            @RequestHeader(value = "nomba-signature") String signature,
            @RequestBody String rawPayload
            ){
        // add necessary logging Slf4j

        System.out.println("Moving from controller layer to service");
        webhookService.handleWebhook(rawPayload, signature);

        return ResponseEntity.ok().build();
    }
}
