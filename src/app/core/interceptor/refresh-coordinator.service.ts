import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RefreshCoordinator {
  isRefreshing = false;
  readonly result$ = new BehaviorSubject<boolean | null>(null);
}
