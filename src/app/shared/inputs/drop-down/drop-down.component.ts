import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-drop-down',
  standalone: true,
  imports: [
    CommonModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropDownComponent),
      multi: true
    }
  ],
  templateUrl: './drop-down.component.html',
  styleUrl: './drop-down.component.scss'
})
export class DropDownComponent {
  @Input() list: any[] = [];
  @Input() disabled: boolean = false;
  @Input() hidden: boolean = false;
  @Input() required: boolean = false;
  @Input() title: string = '';
  @Input() name: string = '';
  @Input() value: any;

  onChange: any = () => {};

  onTouched: any = () => {};

  public onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.value = value;
    this.onChange(value);
  }

  writeValue(value: any): void {
    if (value) {
      this.value = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    
  }
}
