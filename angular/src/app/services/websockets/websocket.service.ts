import { BehaviorSubject } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';

export class WebSocketService {
	public message$: BehaviorSubject<string> = new BehaviorSubject('');
	private socket = io(environment.socketEndPoint);

	public sendMessage(message: string) {
		this.socket.emit('message', message);
	}

	public disconnect() {
		this.socket.disconnect();
		this.message$.next(
			`CLIENT: disconnected from host ${environment.socketEndPoint}`
		);
	}

	public getNewMessage = () => {
		this.socket.on('message', (message) => {
			this.message$.next(message);
		});
		return this.message$.asObservable();
	};
}
