package ru.mmvit.garudar.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mmvit.garudar.dto.PaymentOrderDTO;
import ru.mmvit.garudar.mapper.PaymentOrderMapper;
import ru.mmvit.garudar.model.PaymentOrder;
import ru.mmvit.garudar.repository.PaymentOrderRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PaymentOrderService {

    @Autowired
    private PaymentOrderRepository repository;

    @Autowired
    private PaymentOrderMapper mapper;

    // -------------------------------
    // Создание новой записи
    // -------------------------------
    public PaymentOrderDTO createPaymentOrder(PaymentOrderDTO dto) {
        PaymentOrder po = new PaymentOrder();

        // Маппинг и валидация через entity
        mapper.toEntity(dto, po);

        // Проверяем все обязательные поля перед сохранением
        po.validateAllRequiredForSubmit();

        PaymentOrder saved = repository.save(po);
        return mapper.toDTO(saved);
    }

    // -------------------------------
    // Обновление существующей записи
    // -------------------------------
    public PaymentOrderDTO updatePaymentOrder(Long id, PaymentOrderDTO dto) {
        PaymentOrder existing = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("PaymentOrder not found with id: " + id));

        // Маппинг новых данных (null поля пропускаются)
        mapper.toEntity(dto, existing);

        // Проверка всех обязательных полей
        existing.validateAllRequiredForSubmit();

        PaymentOrder saved = repository.save(existing);
        return mapper.toDTO(saved);
    }

    // -------------------------------
    // Удаление записи
    // -------------------------------
    public void deletePaymentOrder(Long id) {
        PaymentOrder existing = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("PaymentOrder not found with id: " + id));
        repository.delete(existing);
    }

    // -------------------------------
    // Получение списка всех записей
    // -------------------------------
    public List<PaymentOrderDTO> getAllPaymentOrders() {
        return repository.findAll()
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    // -------------------------------
    // Получение списка записей конкретного пользователя (по clientId)
    // -------------------------------
    public List<PaymentOrderDTO> getPaymentOrdersByClientId(String clientId) {
        return repository.findByClientId(clientId)
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    // -------------------------------
    // Получение одной записи по id
    // -------------------------------
    public PaymentOrderDTO getPaymentOrderById(Long id) {
        PaymentOrder po = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("PaymentOrder not found with id: " + id));
        return mapper.toDTO(po);
    }

    // -------------------------------
    // Получение одной записи по orderId
    // -------------------------------
    public PaymentOrderDTO getPaymentOrderByOrderId(String orderId) {
        PaymentOrder po = repository.findByOrderId(orderId);
        if (po == null) throw new IllegalArgumentException("PaymentOrder not found with orderId: " + orderId);
        return mapper.toDTO(po);
    }
}
