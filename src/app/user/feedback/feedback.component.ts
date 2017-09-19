/**
 * Created by asus on 2017/8/17.
 */
import { Component, ElementRef, Inject, OnInit, Renderer, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
})

export class FeedbackComponent implements OnInit {

  user;
  content;
  showSpinner = false;
  @ViewChild('commitButton') commitButton: ElementRef;
  constructor(private store: Store<any>, private router: Router, private route: ActivatedRoute,
    private userService: UserService, private renderer: Renderer) {
  }

  ngOnInit() {
    this.store.select('user').subscribe(data => {
      this.user = data;
    });
  }

  commit() {
    if ( this.content ) {
        this.showSpinner = true;
        this.renderer.setElementAttribute(this.commitButton.nativeElement, 'disabled', 'true');
        this.userService.insert(this.content, this.user.isLogin, this.user.user.id).subscribe(() => {
          this.store.select('router').subscribe((data: any) => {
            console.log(data);
            this.router.navigate([data.url]);
          });
        });
    }//if
  }
  back() {
    this.store.select('router').subscribe((x: any) => {
      this.router.navigate([x.url]);
    });
  }

}

