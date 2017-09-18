import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

/**
 * Created by asus on 2017/8/15.
 */

@Component({
    selector: 'app-page-not-found',
    template: `
    <div class="middle-box text-center animated fadeInDown">
    <h1>404</h1>
    <h2 class="font-bold">页面不存在</h2>
    <h3>
        搞事情？
    </h3>
    <h4>
        你想搞事情？
    </h4>
    <h5>
        <a routerLink='/travel'>回去</a>
    </h5>
</div>
    `,
})
export class PageNotFoundComponent implements OnInit {
    constructor(private store: Store<any>, private router: Router) { }

    ngOnInit(): void {
        this.store.select('router').subscribe((data: any) => {
            console.log(data);
            this.router.navigate([data.url]);
        });
    }
}
