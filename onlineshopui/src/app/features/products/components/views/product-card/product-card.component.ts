import { Component, input, output, ChangeDetectionStrategy, computed } from '@angular/core';
import { ProductDto } from '../../../../../core/types/dtos/product.dto';
import { CardComponent } from '../../../../../clib/components/card/card.component';
import { HasRoleDirective } from '../../../../auth/directives/has-role.directive';
import { UserRole } from '../../../../../core/types/enums/user-roles.enum';
import { TooltipDirective } from '../../../../../clib/directives/tooltip.directive';

@Component({
    selector: 'app-product-card',
    standalone: true,
    imports: [CardComponent, HasRoleDirective, TooltipDirective],
    templateUrl: './product-card.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
    product = input.required<ProductDto>();
    viewDetails = output<string>();
    addToCart = output<string>();
    edit = output<string>();
    delete = output<string>();

    imageUrl = computed(() => this.product().imageUrl || '/placeholder-product.svg');
    readonly UserRole = UserRole;

    supplierTooltipContent = computed(() => {
        const supplier = this.product().supplier;
        if (!supplier) return '';

        let content = `<div class="tooltip-title">${supplier.name}</div>`;

        if (supplier.contactEmail || supplier.contactPhone) {
            content += '<div class="tooltip-section">';
            if (supplier.contactEmail) {
                content += `📧 ${supplier.contactEmail}<br>`;
            }
            if (supplier.contactPhone) {
                content += `📞 ${supplier.contactPhone}`;
            }
            content += '</div>';
        }

        if (supplier.address) {
            content += '<div class="tooltip-section">';
            content += `📍 ${supplier.address.streetAddress}<br>`;
            content += `${supplier.address.city}, ${supplier.address.county}<br>`;
            content += `${supplier.address.country}`;
            content += '</div>';
        }

        return content;
    });

    onViewDetails(): void {
        this.viewDetails.emit(this.product().id);
    }

    onAddToCart(): void {
        this.addToCart.emit(this.product().id);
    }

    onEdit(): void {
        this.edit.emit(this.product().id);
    }

    onDelete(): void {
        this.delete.emit(this.product().id);
    }
}
