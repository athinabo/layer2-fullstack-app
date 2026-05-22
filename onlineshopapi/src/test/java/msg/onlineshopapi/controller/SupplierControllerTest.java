package msg.onlineshopapi.controller;

import msg.onlineshopapi.config.TestSecurityConfig;
import msg.onlineshopapi.dto.AddressDto;
import msg.onlineshopapi.dto.SupplierDto;
import msg.onlineshopapi.dto.mapper.SupplierMapper;
import msg.onlineshopapi.model.Address;
import msg.onlineshopapi.model.Supplier;
import msg.onlineshopapi.security.JwtService;
import msg.onlineshopapi.service.SupplierService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SupplierController.class)
@Import(TestSecurityConfig.class)
class SupplierControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private SupplierService supplierService;

    @MockitoBean
    private SupplierMapper supplierMapper;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserDetailsService userDetailsService;

    private final UUID supplierId = UUID.randomUUID();

    @Test
    @WithMockUser(roles = "CUSTOMER")
    void getAll_returnsSuppliers() throws Exception {
        Supplier supplier = Supplier.builder()
                .id(supplierId)
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

        SupplierDto dto = supplierDto(supplierId, "TechPro Electronics");

        when(supplierService.findAll()).thenReturn(List.of(supplier));
        when(supplierMapper.toDto(supplier)).thenReturn(dto);

        mockMvc.perform(get("/suppliers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(supplierId.toString()))
                .andExpect(jsonPath("$[0].name").value("TechPro Electronics"))
                .andExpect(jsonPath("$[0].contactEmail").value("sales@techpro.com"))
                .andExpect(jsonPath("$[0].address.country").value("USA"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAll_returnsSuppliers_whenAdmin() throws Exception {
        Supplier supplier1 = Supplier.builder().id(supplierId).name("TechPro Electronics").build();
        Supplier supplier2 = Supplier.builder().id(UUID.randomUUID()).name("Global Gadgets Ltd").build();

        SupplierDto dto1 = supplierDto(supplierId, "TechPro Electronics");
        SupplierDto dto2 = supplierDto(UUID.randomUUID(), "Global Gadgets Ltd");

        when(supplierService.findAll()).thenReturn(List.of(supplier1, supplier2));
        when(supplierMapper.toDto(supplier1)).thenReturn(dto1);
        when(supplierMapper.toDto(supplier2)).thenReturn(dto2);

        mockMvc.perform(get("/suppliers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("TechPro Electronics"))
                .andExpect(jsonPath("$[1].name").value("Global Gadgets Ltd"));
    }

    private SupplierDto supplierDto(UUID id, String name) {
        return SupplierDto.builder()
                .id(id)
                .name(name)
                .contactEmail("sales@techpro.com")
                .contactPhone("+1-555-0100")
                .address(AddressDto.builder()
                        .country("USA")
                        .city("San Francisco")
                        .county("San Francisco County")
                        .streetAddress("123 Tech Street")
                        .build())
                .build();
    }
}
