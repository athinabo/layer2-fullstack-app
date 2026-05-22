import {
    Component,
    OnInit,
    inject,
    signal,
    computed,
    ChangeDetectionStrategy
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardComponent } from '../../../../../clib/components/card/card.component';
import { SpinnerComponent } from '../../../../../clib/components/spinner/spinner.component';
import { IconComponent } from '../../../../../clib/components/icon/icon.component';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../../cart/services/cart.service';
import { AppNavRoutes } from '../../../../../core/config/constants/navigation.constants';
import { NotificationsService } from '../../../../../core/services/notifications.service';
import { TooltipDirective } from '../../../../../clib/directives/tooltip.directive';
import { take } from 'rxjs';

@Component({
    selector: 'app-product-detail-page',
    standalone: true,
    imports: [CardComponent, SpinnerComponent, IconComponent, TooltipDirective],
    templateUrl: './product-detail-page.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailPageComponent implements OnInit {
    private readonly productService = inject(ProductService);
    private readonly cartService = inject(CartService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly notificationsService = inject(NotificationsService);

    readonly product = this.productService.selectedProduct;
    readonly loading = this.productService.loading;
    readonly error = this.productService.error;
    readonly quantity = signal(1);

    readonly totalPrice = computed(() => {
        const prod = this.product();
        const qty = this.quantity();
        return prod ? (prod.price * qty).toFixed(2) : '0.00';
    });

    supplierTooltipContent = computed(() => {
        const product = this.product();
        if (!product) return '';

        const supplier = product.supplier;
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

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.productService.loadById(id).pipe(take(1)).subscribe();
        } else {
            this.router.navigate([
                `/${AppNavRoutes.Products.root}/${AppNavRoutes.Products.features.overview}`
            ]);
        }
    }

    getImageUrl(): string {
        return this.product()?.imageUrl || '/placeholder-product.svg';
    }

    handleImageError(event: Event): void {
        const img = event.target as HTMLImageElement;
        img.src = '/placeholder-product.svg';
    }

    incrementQuantity(): void {
        this.quantity.update(q => q + 1);
    }

    decrementQuantity(): void {
        this.quantity.update(q => Math.max(1, q - 1));
    }

    onAddToCart(): void {
        const prod = this.product();
        if (prod) {
            this.cartService.addItem(prod.id, this.quantity());
            this.notificationsService.notifySuccess({
                title: 'Added to cart',
                message: `${prod.name} was added to your cart.`
            });
        }
    }

    goBack(): void {
        this.router.navigate([
            `/${AppNavRoutes.Products.root}/${AppNavRoutes.Products.features.overview}`
        ]);
    }

    retry(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.productService.loadById(id).pipe(take(1)).subscribe();
        }
    }
}
