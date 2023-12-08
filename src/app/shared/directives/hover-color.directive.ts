import { ChangeDetectorRef, Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHoverColor]'
})
export class HoverColorDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('mouseenter') onMouseEnter() {
    this.hover(true);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.hover(false);
  }

  private hover(add: boolean) {
    if (this.el && this.el.nativeElement) {
      if (add) {
        this.renderer.addClass(this.el.nativeElement, 'hover-color');
      } else {
        this.renderer.removeClass(this.el.nativeElement, 'hover-color');
      }
    }
  }
}
