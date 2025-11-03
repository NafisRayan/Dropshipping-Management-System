"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const user_entity_1 = require("../modules/users/entities/user.entity");
const customer_entity_1 = require("../modules/customers/entities/customer.entity");
const address_entity_1 = require("../modules/customers/entities/address.entity");
const product_entity_1 = require("../modules/products/entities/product.entity");
const order_entity_1 = require("../modules/orders/entities/order.entity");
const order_item_entity_1 = require("../modules/orders/entities/order-item.entity");
const order_status_history_entity_1 = require("../modules/orders/entities/order-status-history.entity");
const inventory_log_entity_1 = require("../modules/inventory/entities/inventory-log.entity");
const supplier_entity_1 = require("../modules/suppliers/entities/supplier.entity");
exports.databaseConfig = {
    type: 'sqlite',
    database: 'database.sqlite',
    entities: [
        user_entity_1.User,
        customer_entity_1.Customer,
        address_entity_1.Address,
        product_entity_1.Product,
        order_entity_1.Order,
        order_item_entity_1.OrderItem,
        order_status_history_entity_1.OrderStatusHistory,
        inventory_log_entity_1.InventoryLog,
        supplier_entity_1.Supplier,
    ],
    synchronize: true,
    logging: process.env.NODE_ENV === 'development',
};
//# sourceMappingURL=database.config.js.map