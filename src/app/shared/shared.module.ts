import {
  MdButtonModule, MdCheckboxModule, MdTabsModule, MdCardModule, MdRadioModule,
  MdInputModule, MdToolbarModule, MdSidenavModule, MdMenuModule, MdSnackBarModule,
  MdDialogModule, MdGridListModule, MdSelectModule, MdChipsModule, MdProgressSpinnerModule
} from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimeAgoPipe } from './timeAgo.pipe';
import { ArraySortPipe } from './sort.pipe';
import { LimitSortPipe } from './limit.pipe';
import { FilterLengthPipe, FilterHanziPipe } from './filter.pipe';
// import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import { NgxGalleryModule } from './lib/ngx-gallery/index';
import { ImageUploadModule } from './lib/angular2-image-upload/image-upload.module';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    MdButtonModule,
    MdCheckboxModule,
    MdTabsModule,
    MdCardModule,
    MdInputModule,
    MdToolbarModule,
    MdSidenavModule,
    MdMenuModule,
    MdSnackBarModule,
    MdDialogModule,
    MdGridListModule,
    MdRadioModule,
    MdSelectModule,
    MdChipsModule,
    // NKDatetimeModule,
    ImageUploadModule.forRoot(),
    NgxGalleryModule,
    MdProgressSpinnerModule
  ],
  declarations: [TimeAgoPipe, ArraySortPipe, LimitSortPipe, FilterLengthPipe, FilterHanziPipe],
  exports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    MdButtonModule,
    MdCheckboxModule,
    MdTabsModule,
    MdCardModule,
    MdInputModule,
    MdToolbarModule,
    MdSidenavModule,
    MdMenuModule,
    MdSnackBarModule,
    MdDialogModule,
    MdGridListModule,
    MdRadioModule,
    MdSelectModule,
    MdChipsModule,
    TimeAgoPipe,
    ArraySortPipe,
    LimitSortPipe,
    FilterLengthPipe,
    FilterHanziPipe,
    // NKDatetimeModule,
    ImageUploadModule,
    NgxGalleryModule,
    MdProgressSpinnerModule
  ],
})
export class SharedModule { }
