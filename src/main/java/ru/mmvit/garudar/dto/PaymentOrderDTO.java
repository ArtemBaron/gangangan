package ru.mmvit.garudar.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentOrderDTO {
    private Long id;
    private String orderId;

    private String clientId;
    private BigDecimal amount;
    private String currency;

    private String beneficiaryName;
    private String beneficiaryAddress;

    private String destinationAccountNumber;
    private String countryBank;

    private String bic;
    private String bankName;
    private String bankAddress;

    private String remarkMode;
    private String transactionRemark;

    private Map<String, String> remarkTokens;

    private String status;
    private Date createdAt;
    private Date updatedAt;
}
