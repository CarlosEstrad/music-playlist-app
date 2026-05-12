import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
    message: string;
    type: 'success' | 'error' | 'info';
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private notificationSubject = new Subject<Notification | null>();
    notification$ = this.notificationSubject.asObservable();

    showSuccess(message: string) {
        this.notificationSubject.next({ message, type: 'success' });
        this.autoHide();
    }

    showError(message: string) {
        this.notificationSubject.next({ message, type: 'error' });
        this.autoHide();
    }

    private autoHide() {
        setTimeout(() => {
            this.notificationSubject.next(null);
        }, 4000); // Se oculta tras 4 segundos
    }
}