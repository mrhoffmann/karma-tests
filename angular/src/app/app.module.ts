import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WebsocketService } from './services/websockets/websockets.service';

@NgModule({
	declarations: [AppComponent],
	imports: [BrowserModule, AppRoutingModule],
	providers: [WebsocketService],
	bootstrap: [AppComponent],
})
export class AppModule {
	title = 'socketrv';
	content = '';
	received = [];
	sent = [];

	constructor(private WebsocketService: WebsocketService) {
		WebsocketService.messages.subscribe((msg) => {
			this.received.push(msg);
			console.log('Response from websocket: ' + msg);
		});
	}

	sendMsg() {
		let message = {
			source: '',
			content: '',
		};
		message.source = 'localhost';
		message.content = this.content;

		this.sent.push(message);
		this.SocketService.messages.next(message);
	}
}
