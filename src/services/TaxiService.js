import { v4 as uuid } from 'uuid';
import { db } from '../store/db.js';

export class TaxiService {
  estimate({ from, to, tariff }) {
    const base = tariff === 'business' ? 10 : tariff === 'comfort' ? 6 : 4;
    const distanceKm = Math.max(2, Math.floor(Math.random() * 18));
    return { distanceKm, price: base * distanceKm, etaMin: Math.max(5, Math.floor(distanceKm * 1.5)) };
  }
  order({ userId, from, to, tariff }) {
    const estimate = this.estimate({ from, to, tariff });
    const order = { id: uuid(), userId, from, to, tariff, ...estimate, status: 'searching_driver', createdAt: Date.now() };
    db.taxiOrders.set(order.id, order);
    return order;
  }
}
