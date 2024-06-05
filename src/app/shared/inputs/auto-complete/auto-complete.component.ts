import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, forwardRef, ViewChild, ElementRef } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auto-complete',
  standalone: true,
  imports: [
    MatFormFieldModule,
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    AsyncPipe
  ],
  templateUrl: './auto-complete.component.html',
  styleUrl: './auto-complete.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutoCompleteComponent),
      multi: true
    }
  ],
})
export class AutoCompleteComponent {

  @ViewChild('inputField') inputField!: ElementRef;

  isAutoCompleteOpen = false;

  @Input() autoCompleteOptions: Observable<string[]> = new Observable<string[]>;
  @Input() placeHolder: string = '';
  @Input() name: string = '';
  @Input() required: boolean = false;
  @Input() title: string = '';
  @Input() disabled: boolean = false;
  @Input() formControl: FormControl = new FormControl({ value: '', disabled: this.disabled });

  @Output() valueChanged = new EventEmitter<string>();

  onChange: any = () => { };
  onTouched: any = () => { };

  onAutoCompleteOpened() {
    this.isAutoCompleteOpen = true;
  }

  onAutoCompleteClosed() {
    this.isAutoCompleteOpen = false;
  }

  onBlurChanged(value: Event) {
    if (!this.isAutoCompleteOpen) {
      const val = value.target as HTMLInputElement;
      this.valueChanged.emit(val.value);
    }
  }

  public onChanged(event: MatAutocompleteSelectedEvent) {
    const selectedUhid = event.option.value;
    this.valueChanged.emit(selectedUhid);

    this.isAutoCompleteOpen = false;
  }
  focusInput() {
    this.inputField.nativeElement.focus();
  }

  writeValue(value: any): void {
    if (value) {
      this.formControl.setValue(value);
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
      this.formControl.disable();
    } else {
      this.formControl.enable();
    }
  }
}
