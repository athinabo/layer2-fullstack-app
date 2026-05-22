package msg.onlineshopapi.service;

import lombok.RequiredArgsConstructor;
import msg.onlineshopapi.exception.ResourceNotFoundException;
import msg.onlineshopapi.model.Product;
import msg.onlineshopapi.model.Supplier;
import msg.onlineshopapi.repository.ProductRepository;
import msg.onlineshopapi.repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;

    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public Optional<Product> findById(UUID id) {
        return productRepository.findById(id);
    }

    public Product save(Product product) {
        // Fetch and set full Supplier entity if needed
        if (product.getSupplier() != null && product.getSupplier().getId() != null) {
            Supplier fullSupplier = supplierRepository.findById(product.getSupplier().getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Supplier not found with id: " + product.getSupplier().getId()));
            product.setSupplier(fullSupplier);
        }
        return productRepository.save(product);
    }

    public Product update(UUID id, Product product) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        existing.setName(product.getName());
        existing.setDescription(product.getDescription());
        existing.setPrice(product.getPrice());
        existing.setWeight(product.getWeight());
        existing.setCategory(product.getCategory());

        // Fetch and set full Supplier entity
        if (product.getSupplier() != null && product.getSupplier().getId() != null) {
            Supplier fullSupplier = supplierRepository.findById(product.getSupplier().getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Supplier not found with id: " + product.getSupplier().getId()));
            existing.setSupplier(fullSupplier);
        }

        existing.setImageUrl(product.getImageUrl());
        return productRepository.save(existing);
    }

    public void deleteById(UUID id) {
        productRepository.deleteById(id);
    }
}
