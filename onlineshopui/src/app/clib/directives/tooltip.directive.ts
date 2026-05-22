import { Directive, ElementRef, HostListener, Input, Renderer2, inject } from '@angular/core';

@Directive({
    selector: '[appTooltip]',
    standalone: true
})
export class TooltipDirective {
    @Input('appTooltip') tooltipContent = '';
    @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';

    private readonly elementRef = inject(ElementRef);
    private readonly renderer = inject(Renderer2);
    private tooltipElement: HTMLElement | null = null;

    @HostListener('mouseenter')
    onMouseEnter(): void {
        this.showTooltip();
    }

    @HostListener('mouseleave')
    onMouseLeave(): void {
        this.hideTooltip();
    }

    private showTooltip(): void {
        if (!this.tooltipContent) return;

        const tooltip = this.renderer.createElement('div') as HTMLElement;
        this.renderer.addClass(tooltip, 'tooltip');
        this.renderer.addClass(tooltip, `tooltip-${this.tooltipPosition}`);
        tooltip.innerHTML = this.tooltipContent;

        const hostPos = this.elementRef.nativeElement.getBoundingClientRect();
        this.renderer.appendChild(document.body, tooltip);

        const tooltipPos = tooltip.getBoundingClientRect();

        let top = 0;
        let left = 0;

        switch (this.tooltipPosition) {
            case 'top':
                top = hostPos.top - tooltipPos.height - 8;
                left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
                break;
            case 'bottom':
                top = hostPos.bottom + 8;
                left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
                break;
            case 'left':
                top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
                left = hostPos.left - tooltipPos.width - 8;
                break;
            case 'right':
                top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
                left = hostPos.right + 8;
                break;
        }

        this.renderer.setStyle(tooltip, 'top', `${top + window.scrollY}px`);
        this.renderer.setStyle(tooltip, 'left', `${left + window.scrollX}px`);

        this.tooltipElement = tooltip;
    }

    private hideTooltip(): void {
        if (this.tooltipElement) {
            this.renderer.removeChild(document.body, this.tooltipElement);
            this.tooltipElement = null;
        }
    }
}
