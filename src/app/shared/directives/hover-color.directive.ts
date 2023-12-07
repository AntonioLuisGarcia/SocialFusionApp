import { ChangeDetectorRef, Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHoverColor]'
})
export class HoverColorDirective {

  constructor(private el: ElementRef, private renderer: Renderer2, private cd: ChangeDetectorRef) { }

  @HostListener('mouseenter') onMouseEnter() {
    this.hover('blue');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.hover("");
  }

  private hover(color: string) {
    if (this.el && this.el.nativeElement) {
      this.renderer.setStyle(this.el.nativeElement, 'color', color);
      this.cd.detectChanges();
    }
  }
}
