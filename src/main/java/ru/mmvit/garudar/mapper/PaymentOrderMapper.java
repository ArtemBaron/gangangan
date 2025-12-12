package ru.mmvit.garudar.mapper;

import org.springframework.stereotype.Component;
import ru.mmvit.garudar.dto.PaymentOrderDTO;
import ru.mmvit.garudar.model.PaymentOrder;

@Component
public class PaymentOrderMapper {

    public PaymentOrder toEntity(PaymentOrderDTO dto, PaymentOrder po) {

        if (dto.getClientId() != null)
            po.setClientId(dto.getClientId());

        if (dto.getAmount() != null)
            po.setAmount(dto.getAmount());

        if (dto.getCurrency() != null)
            po.setCurrency(PaymentOrder.Currency.valueOf(dto.getCurrency()));

        if (dto.getBeneficiaryName() != null)
            po.setBeneficiaryName(dto.getBeneficiaryName());

        if (dto.getBeneficiaryAddress() != null)
            po.setBeneficiaryAddress(dto.getBeneficiaryAddress());

        if (dto.getCountryBank() != null)
            po.setCountryBank(dto.getCountryBank());

        if (dto.getDestinationAccountNumber() != null)
            po.setDestinationAccountNumber(dto.getDestinationAccountNumber());

        if (dto.getBic() != null)
            po.setBic(dto.getBic());

        if (dto.getBankName() != null)
            po.setBankName(dto.getBankName());

        if (dto.getBankAddress() != null)
            po.setBankAddress(dto.getBankAddress());

        if (dto.getRemarkMode() != null)
            po.setRemarkMode(dto.getRemarkMode());

        if (dto.getTransactionRemark() != null)
            po.setTransactionRemark(dto.getTransactionRemark());

        if (dto.getRemarkTokens() != null)
            po.setRemarkTokens(dto.getRemarkTokens());

        return po;
    }

    public PaymentOrderDTO toDTO(PaymentOrder po) {
        PaymentOrderDTO dto = new PaymentOrderDTO();

        dto.setId(po.getId());
        dto.setOrderId(po.getOrderId());

        dto.setClientId(po.getClientId());
        dto.setAmount(po.getAmount());
        dto.setCurrency(po.getCurrency().name());

        dto.setBeneficiaryName(po.getBeneficiaryName());
        dto.setBeneficiaryAddress(po.getBeneficiaryAddress());

        dto.setDestinationAccountNumber(po.getDestinationAccountNumber());
        dto.setCountryBank(po.getCountryBank());

        dto.setBic(po.getBic());
        dto.setBankName(po.getBankName());
        dto.setBankAddress(po.getBankAddress());

        dto.setRemarkMode(po.getRemarkMode());
        dto.setTransactionRemark(po.getTransactionRemark());
        dto.setRemarkTokens(po.getRemarkTokens());

        dto.setStatus(po.getStatus().name());
        dto.setCreatedAt(po.getCreatedAt());
        dto.setUpdatedAt(po.getUpdatedAt());

        return dto;
    }

}
