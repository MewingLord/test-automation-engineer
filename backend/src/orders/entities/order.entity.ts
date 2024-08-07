import { CreateOrderDto } from "../dto/create-order.dto";
import { OrderInterface } from "../dto/order.interface";
import { UpdateOrderDto } from "../dto/update-order.dto";

export class Order {
    private orders: OrderInterface[] = [];

  constructor() {
    this.orders = [];

  }

  createOrder(order: CreateOrderDto) {
    const ids = this.orders.map(order => order.id).sort((a, b) => a - b).reverse();
    console.log(ids);
    const newId = ids.length === 0 ? 1 : ids[0] + 1;
    this.orders.push({...order, id: newId });
    return order;
  }
  
  getOrders() {
    return this.orders;
  }

  getOrderById(id: number) {
    return this.orders.find(order => order.id === id);
  }

  updateOrder(id: number, order: UpdateOrderDto) {
    const index = this.orders.findIndex(order => order.id === id);
    this.orders[index] = { ...this.orders[index], ...order };
    return this.orders[index];
  }

  deleteOrder(id: number) {
    const index = this.orders.findIndex(order => order.id === id);
    this.orders.splice(index, 1);
    return this.orders;
  }
}
