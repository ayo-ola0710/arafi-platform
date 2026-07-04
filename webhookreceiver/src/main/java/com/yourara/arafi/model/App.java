package com.yourara.arafi.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "apps", schema = "arafi")
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class App {
    @Id
    private UUID id;

    @Column(name = "webhook_url")
    private String webhookUrl;

    @Column(name = "payout_bank_account")
    private String payoutBankAccountNumber;

    @Column(name = "payout_bank_code")
    private String payoutBankCode;

    @Column(name = "payout_bank_name")
    private String payoutBankName;
}
