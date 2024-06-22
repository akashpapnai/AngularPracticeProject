import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-text-field',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextFieldComponent),
      multi: true
    }
  ],
})
export class TextFieldComponent {
  @Input() name: string = '';
  @Input() title: string = '';
  @Input() disabled: boolean = false;
  @Input() value: string = '';
  @Input() placeHolder: string = '';
  @Input() required: boolean = false;
  @Input() type: string = 'text';
  @Input() autoComplete: string = 'on';
  @Input() highlight: boolean = false;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};
  
  public onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.value = value.toString();
    this.onChange(value.toString());
  }
  
  writeValue(value: any): void {
    this.value = (value !== null ? value.toString() : '');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
