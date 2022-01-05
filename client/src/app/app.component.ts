import { Component, OnInit } from '@angular/core';
import { GreeterService } from './greeter.service';

@Component({
    selector: 'app-root',
    template: `
    <p>open dev tools (F12) and refresh (F5) to see it in action</p>
    <p>greeter.sayHello(...) => <span>{{sayHelloResponse | json}}</span></p>
  `
})
export class AppComponent implements OnInit {
    constructor(
        private readonly greeter: GreeterService
    ) { }

    sayHelloResponse: any;

    readonly greet = () => this.greeter.sayHello({
        name: "simple grpc demo",
        client: "" /* optional proto prop requires a default value provided */
    });

    async ngOnInit() {
        this.sayHelloResponse = await this.greet().catch(err => err);
    }
}