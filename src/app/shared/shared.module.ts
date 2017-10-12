import {
  MatButtonModule, MatCheckboxModule, MatTabsModule, MatCardModule, MatRadioModule,
  MatInputModule, MatToolbarModule, MatSidenavModule, MatMenuModule, MatSnackBarModule,
  MatDialogModule, MatGridListModule, MatSelectModule, MatChipsModule, MatProgressSpinnerModule
} from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimeAgoPipe } from './timeAgo.pipe';
import { ArraySortPipe } from './sort.pipe';
import { LimitSortPipe } from './limit.pipe';
import { FilterLengthPipe, FilterHanziPipe } from './filter.pipe';
import { NgxGalleryModule } from './lib/ngx-gallery/index';
import { ImageUploadModule } from './lib/angular2-image-upload/image-upload.module';
import { DateTimePickerModule } from 'ng-pick-datetime';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTabsModule,
    MatCardModule,
    MatInputModule,
    MatToolbarModule,
    MatSidenavModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
    MatGridListModule,
    MatRadioModule,
    MatSelectModule,
    MatChipsModule,
    ImageUploadModule.forRoot(),
    NgxGalleryModule,
    MatProgressSpinnerModule,
    DateTimePickerModule
  ],
  declarations: [TimeAgoPipe, ArraySortPipe, LimitSortPipe, FilterLengthPipe, FilterHanziPipe],
  exports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTabsModule,
    MatCardModule,
    MatInputModule,
    MatToolbarModule,
    MatSidenavModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
    MatGridListModule,
    MatRadioModule,
    MatSelectModule,
    MatChipsModule,
    TimeAgoPipe,
    ArraySortPipe,
    LimitSortPipe,
    FilterLengthPipe,
    FilterHanziPipe,
    ImageUploadModule,
    NgxGalleryModule,
    MatProgressSpinnerModule,
    DateTimePickerModule
  ],
})
export class SharedModule { }
