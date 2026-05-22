package msg.onlineshopapi.dto.mapper;

import lombok.RequiredArgsConstructor;
import msg.onlineshopapi.dto.SupplierDto;
import msg.onlineshopapi.model.Supplier;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SupplierMapper {

    private final AddressMapper addressMapper;

    public SupplierDto toDto(Supplier supplier) {
        if (supplier == null) {
            return null;
        }

        return SupplierDto.builder()
                .id(supplier.getId())
                .name(supplier.getName())
                .contactEmail(supplier.getContactEmail())
                .contactPhone(supplier.getContactPhone())
                .address(supplier.getAddress() != null ? addressMapper.toDto(supplier.getAddress()) : null)
                .build();
    }
}
