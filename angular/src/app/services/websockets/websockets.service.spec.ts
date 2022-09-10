import { TestBed } from '@angular/core/testing';
import { WebSocketService } from './websocket.service';

describe('WebSocketsService', () => {
	let server: WebSocketService;
	let messages: string[];
	let spy: any;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [],
			providers: [WebSocketService],
		});
		messages = [];
		server = TestBed.inject(WebSocketService);
		spy = spyOn(server, 'sendMessage').and.callThrough();
		server.getNewMessage().subscribe((value: string) => {
			messages.push(value);
		});
	});

	afterAll(() => {
		server.disconnect();
	});

	it('should be able to send a message', (done) => {
		const input = 'testar';
		server.sendMessage(input);
		expect(messages.filter((x) => x == input)).toBeTruthy();
		expect(server.sendMessage).toHaveBeenCalledOnceWith(input);
		expect(spy).toHaveBeenCalledOnceWith(input);
		done();
	});
});
