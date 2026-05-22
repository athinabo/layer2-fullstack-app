package msg.onlineshopapi.service;

import msg.onlineshopapi.model.Address;
import msg.onlineshopapi.model.Supplier;
import msg.onlineshopapi.repository.SupplierRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SupplierServiceTest {

    @Mock
    private SupplierRepository supplierRepository;

    @InjectMocks
    private SupplierService supplierService;

    private Supplier supplier1;
    private Supplier supplier2;

    @BeforeEach
    void setUp() {
        supplier1 = Supplier.builder()
                .id(UUID.randomUUID())
                .name("TechPro Electronics")
                .contactEmail("sales@techpro.com")
                .contactPhone("+1-555-0100")
                .address(Address.builder()
                        .country("USA")
                        .city("San Francisco")
                        .county("San Francisco County")
                        .streetAddress("123 Tech Street")
                        .build())
                .build();

        supplier2 = Supplier.builder()
                .id(UUID.randomUUID())
                .name("Global Gadgets Ltd")
                .contactEmail("info@globalgadgets.co.uk")
                .contactPhone("+44-20-7946-0958")
                .address(Address.builder()
                        .country("United Kingdom")
                        .city("London")
                        .county("Greater London")
                        .streetAddress("45 Innovation Way")
                        .build())
                .build();
    }

    @Test
    void findAll_returnsAllSuppliers() {
        // Arrange
        List<Supplier> expectedSuppliers = List.of(supplier1, supplier2);
        when(supplierRepository.findAll()).thenReturn(expectedSuppliers);

        // Act
        List<Supplier> actualSuppliers = supplierService.findAll();

        // Assert
        assertThat(actualSuppliers).hasSize(2);
        assertThat(actualSuppliers).containsExactly(supplier1, supplier2);
        verify(supplierRepository).findAll();
    }

    @Test
    void findAll_returnsEmptyList_whenNoSuppliers() {
        // Arrange
        when(supplierRepository.findAll()).thenReturn(List.of());

        // Act
        List<Supplier> actualSuppliers = supplierService.findAll();

        // Assert
        assertThat(actualSuppliers).isEmpty();
        verify(supplierRepository).findAll();
    }

    @Test
    void findAll_delegatesToRepository() {
        // Arrange
        when(supplierRepository.findAll()).thenReturn(List.of(supplier1));

        // Act
        supplierService.findAll();

        // Assert
        verify(supplierRepository).findAll();
    }
}
