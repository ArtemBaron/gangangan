package ru.mmvit.garudar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.mmvit.garudar.model.PaymentOrder;

import java.util.List;

@Repository
public interface PaymentOrderRepository extends JpaRepository<PaymentOrder, Long> {


    // Поиск по clientId
    List<PaymentOrder> findByClientId(String clientId);

    // Поиск по orderId
    PaymentOrder findByOrderId(String orderId);

}
