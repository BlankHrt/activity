/**
 * Created by asus on 2017/8/17.
 */
import { Component, ElementRef, Inject, OnInit, Renderer, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserService } from '../../user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
})

export class FeedbackComponent implements OnInit {

  user;
  form: FormGroup;
  content: FormControl;
  showSpinner = false;
  @ViewChild('commitButton') commitButton: ElementRef;
  constructor(private store: Store<any>, private router: Router, private route: ActivatedRoute,
    private userService: UserService, private formBuilder: FormBuilder, private renderer: Renderer) {
  }

  ngOnInit() {

    this.store.select('user').subscribe(data => {
      this.user = data;
    });
    this.content = new FormControl('', [Validators.required]);
    this.form = this.formBuilder.group({
      content: this.content,
    });

  }

  commit() {
    this.showSpinner = true;
    this.renderer.setElementAttribute(this.commitButton.nativeElement, 'disabled', 'true');
    this.userService.insert(this.form.value, this.user.isLogin, this.user.user.id).subscribe(() => {
      this.store.select('router').subscribe((data: any) => {
        console.log(data);
        this.router.navigate([data.url]);
      });
    });
  }

  back() {
    this.store.select('router').subscribe((x: any) => {
      this.router.navigate([x.url]);
    });
  }

}

