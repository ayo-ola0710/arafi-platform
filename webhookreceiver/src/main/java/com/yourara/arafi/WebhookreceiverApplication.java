package com.yourara.arafi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class WebhookreceiverApplication {

	public static void main(String[] args) {
		SpringApplication.run(WebhookreceiverApplication.class, args);
	}

}
