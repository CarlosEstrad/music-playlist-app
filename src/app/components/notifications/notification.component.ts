import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notifications/notification-service';

@Component({
    selector: 'app-notification',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="notification-container" *ngIf="notification$ | async as note" [ngClass]="note.type">
      <div class="notification-content">
        <i class="fa" [ngClass]="note.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'"></i>
        <span>{{ note.message }}</span>
      </div>
    </div>
  `,
    styles: [`
    .notification-container {
      position: fixed;
      top: 88%;
      right: 20px;
      padding: 16px 24px;
      border-radius: 8px;
      color: white;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease-out;
      min-width: 300px;
    }
    .success { background-color: #48bb78; border-left: 5px solid #2f855a; }
    .error { background-color: #f56565; border-left: 5px solid #c53030; }
    
    .notification-content {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 500;
    }

    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class NotificationComponent {
    private notificationService = inject(NotificationService);
    
    notification$ = this.notificationService.notification$;
}