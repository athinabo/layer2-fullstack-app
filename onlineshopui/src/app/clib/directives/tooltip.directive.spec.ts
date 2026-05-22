import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TooltipDirective } from './tooltip.directive';

@Component({
    template: `
        <button appTooltip="<div class='tooltip-title'>Test Tooltip</div>" data-testid="tooltip-trigger">
            Hover me
        </button>
    `,
    standalone: true,
    imports: [TooltipDirective]
})
class TestComponent {}

describe('TooltipDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let buttonElement: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestComponent, TooltipDirective]
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        buttonElement = fixture.debugElement.query(By.css('[data-testid="tooltip-trigger"]'));
        fixture.detectChanges();
    });

    afterEach(() => {
        const tooltips = document.querySelectorAll('.tooltip');
        tooltips.forEach(tooltip => tooltip.remove());
    });

    it('should create', () => {
        expect(buttonElement).toBeTruthy();
    });

    it('should show tooltip on mouseenter', () => {
        buttonElement.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));

        const tooltip = document.querySelector('.tooltip');
        expect(tooltip).toBeTruthy();
        expect(tooltip?.innerHTML).toContain('Test Tooltip');
    });

    it('should hide tooltip on mouseleave', () => {
        buttonElement.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
        expect(document.querySelector('.tooltip')).toBeTruthy();

        buttonElement.nativeElement.dispatchEvent(new MouseEvent('mouseleave'));

        expect(document.querySelector('.tooltip')).toBeFalsy();
    });

    it('should apply tooltip-top class by default', () => {
        buttonElement.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));

        const tooltip = document.querySelector('.tooltip');
        expect(tooltip?.classList.contains('tooltip-top')).toBe(true);
    });

    it('should attach tooltip to document body', () => {
        buttonElement.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));

        const tooltip = document.querySelector('.tooltip');
        expect(tooltip?.parentElement).toBe(document.body);
    });

    it('should remove previous tooltip before showing new one', () => {
        buttonElement.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
        expect(document.querySelectorAll('.tooltip').length).toBe(1);

        buttonElement.nativeElement.dispatchEvent(new MouseEvent('mouseleave'));
        buttonElement.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));

        expect(document.querySelectorAll('.tooltip').length).toBe(1);
    });

    it('should handle rapid mouseenter/mouseleave events', () => {
        buttonElement.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
        buttonElement.nativeElement.dispatchEvent(new MouseEvent('mouseleave'));
        buttonElement.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
        buttonElement.nativeElement.dispatchEvent(new MouseEvent('mouseleave'));
        buttonElement.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));

        expect(document.querySelectorAll('.tooltip').length).toBe(1);
    });
});

describe('TooltipDirective - empty content', () => {
    let fixture: ComponentFixture<any>;
    let buttonElement: DebugElement;

    beforeEach(async () => {
        @Component({
            template: `<button appTooltip="" data-testid="tooltip-trigger">Hover me</button>`,
            standalone: true,
            imports: [TooltipDirective]
        })
        class EmptyTooltipComponent {}

        await TestBed.configureTestingModule({
            imports: [EmptyTooltipComponent, TooltipDirective]
        }).compileComponents();

        fixture = TestBed.createComponent(EmptyTooltipComponent);
        buttonElement = fixture.debugElement.query(By.css('[data-testid="tooltip-trigger"]'));
        fixture.detectChanges();
    });

    afterEach(() => {
        const tooltips = document.querySelectorAll('.tooltip');
        tooltips.forEach(tooltip => tooltip.remove());
    });

    it('should not show tooltip when content is empty', () => {
        buttonElement.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));

        expect(document.querySelector('.tooltip')).toBeFalsy();
    });
});

describe('TooltipDirective - position variations', () => {
    afterEach(() => {
        const tooltips = document.querySelectorAll('.tooltip');
        tooltips.forEach(tooltip => tooltip.remove());
    });

    it('should apply tooltip-bottom class', async () => {
        @Component({
            template: `<button appTooltip="Test" tooltipPosition="bottom" data-testid="tooltip-trigger">Hover</button>`,
            standalone: true,
            imports: [TooltipDirective]
        })
        class BottomTooltipComponent {}

        await TestBed.configureTestingModule({
            imports: [BottomTooltipComponent, TooltipDirective]
        }).compileComponents();

        const fixture = TestBed.createComponent(BottomTooltipComponent);
        const buttonElement = fixture.debugElement.query(By.css('[data-testid="tooltip-trigger"]'));
        fixture.detectChanges();

        buttonElement.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));

        const tooltip = document.querySelector('.tooltip');
        expect(tooltip?.classList.contains('tooltip-bottom')).toBe(true);
    });

    it('should apply tooltip-left class', async () => {
        @Component({
            template: `<button appTooltip="Test" tooltipPosition="left" data-testid="tooltip-trigger">Hover</button>`,
            standalone: true,
            imports: [TooltipDirective]
        })
        class LeftTooltipComponent {}

        await TestBed.configureTestingModule({
            imports: [LeftTooltipComponent, TooltipDirective]
        }).compileComponents();

        const fixture = TestBed.createComponent(LeftTooltipComponent);
        const buttonElement = fixture.debugElement.query(By.css('[data-testid="tooltip-trigger"]'));
        fixture.detectChanges();

        buttonElement.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));

        const tooltip = document.querySelector('.tooltip');
        expect(tooltip?.classList.contains('tooltip-left')).toBe(true);
    });

    it('should apply tooltip-right class', async () => {
        @Component({
            template: `<button appTooltip="Test" tooltipPosition="right" data-testid="tooltip-trigger">Hover</button>`,
            standalone: true,
            imports: [TooltipDirective]
        })
        class RightTooltipComponent {}

        await TestBed.configureTestingModule({
            imports: [RightTooltipComponent, TooltipDirective]
        }).compileComponents();

        const fixture = TestBed.createComponent(RightTooltipComponent);
        const buttonElement = fixture.debugElement.query(By.css('[data-testid="tooltip-trigger"]'));
        fixture.detectChanges();

        buttonElement.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));

        const tooltip = document.querySelector('.tooltip');
        expect(tooltip?.classList.contains('tooltip-right')).toBe(true);
    });
});

describe('TooltipDirective - HTML content', () => {
    afterEach(() => {
        const tooltips = document.querySelectorAll('.tooltip');
        tooltips.forEach(tooltip => tooltip.remove());
    });

    it('should render HTML content correctly', async () => {
        @Component({
            template: `<button appTooltip="<div class='tooltip-title'>Title</div><div class='tooltip-section'>Section</div>" data-testid="tooltip-trigger">Hover</button>`,
            standalone: true,
            imports: [TooltipDirective]
        })
        class HtmlTooltipComponent {}

        await TestBed.configureTestingModule({
            imports: [HtmlTooltipComponent, TooltipDirective]
        }).compileComponents();

        const fixture = TestBed.createComponent(HtmlTooltipComponent);
        const buttonElement = fixture.debugElement.query(By.css('[data-testid="tooltip-trigger"]'));
        fixture.detectChanges();

        buttonElement.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));

        const tooltip = document.querySelector('.tooltip');
        expect(tooltip?.querySelector('.tooltip-title')?.textContent).toBe('Title');
        expect(tooltip?.querySelector('.tooltip-section')?.textContent).toBe('Section');
    });
});
