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
import { NgxGalleryModule } from './lib/ngx-gallery/index';
import { ImageUploadModule } from './lib/angular2-image-upload/image-upload.module';
import { Md2Module } from 'md2';

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
    ImageUploadModule.forRoot(),
    NgxGalleryModule,
    MdProgressSpinnerModule,
    Md2Module
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
    ImageUploadModule,
    NgxGalleryModule,
    MdProgressSpinnerModule,
    Md2Module
  ],
})
export class SharedModule { }
