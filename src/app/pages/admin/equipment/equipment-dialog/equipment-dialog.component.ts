import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { Equipment } from '../../../../models/equipment';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-equipment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './equipment-dialog.component.html',
  styleUrls: ['./equipment-dialog.component.scss'],
})
export class EquipmentDialogComponent {
  form: FormGroup;
  imagePreviewUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EquipmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { mode: 'add' | 'edit'; equipment?: Equipment },
    private snackBar: MatSnackBar
  ) {
    const pricing = data.equipment?.pricing ?? {
      day: 0,
      weekend: 0,
      withDelivery: 0,
    };

    this.form = this.fb.group({
      name: [data.equipment?.name ?? '', Validators.required],
      description: [data.equipment?.description ?? ''],
      imageUrl: [data.equipment?.imageUrl ?? ''],
      active: [data.equipment?.active ?? true],
      pricing: this.fb.group({
        day: [pricing.day],
        weekend: [pricing.weekend],
        withDelivery: [pricing.withDelivery],
      }),
    });

    this.imagePreviewUrl = data.equipment?.imageUrl || null;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result as string;
      this.form.patchValue({ imageUrl: base64 });
      this.imagePreviewUrl = base64;
      this.snackBar.open('Bild erfolgreich als Base64 geladen', 'OK', { duration: 3000 });
    };

    reader.onerror = () => {
      this.snackBar.open('Fehler beim Einlesen des Bildes', 'OK', { duration: 3000 });
    };

    reader.readAsDataURL(file);
  }

  removeImage() {
  this.form.patchValue({ imageUrl: '' });
  this.imagePreviewUrl = null;
  this.snackBar.open('Bild entfernt', 'OK', { duration: 3000 });
}

  save() {
    if (this.form.valid) {
      const formValue = this.form.value;
      formValue.imageUrl =
        formValue.imageUrl?.trim() ||
        'https://via.placeholder.com/300x200?text=Kein+Bild';

      this.snackBar.open(
        this.data.mode === 'add' ? 'Equipment hinzugefügt' : 'Änderungen gespeichert',
        'OK',
        { duration: 3000 }
      );

      this.dialogRef.close(formValue);
    } else {
      this.form.markAllAsTouched();
    }
  }


  cancel() {
    this.dialogRef.close(null);
  }
}