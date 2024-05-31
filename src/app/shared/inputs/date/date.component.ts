import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import { FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-date',
  standalone: true,
  imports: [
    CommonModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateComponent),
      multi: true
    }
  ],
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss']
})
export class DateComponent {

  @Input() required: boolean = false;
  @Input() title: string = '';
  @Input() name: string = '';
  @Input() placeHolder: string = '';
  @Input() value: FormControl = new FormControl('');

  public changedDate(event: MatDatepickerInputEvent<any>) {
    this.value.setValue(event.value);
    this.onChange(event.value);
  }

  onChange: any = () => {};

  onTouched: any = () => {};

  writeValue(value: any): void {
    if (value) {
      this.value.setValue(value);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.value.disable();
    } else {
      this.value.enable();
    }
  }
}
