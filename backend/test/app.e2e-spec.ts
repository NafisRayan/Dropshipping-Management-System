import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as fs from 'fs';
import * as path from 'path';
import { AppModule } from '../src/app.module';
import { CreateSupplierDto } from '../src/suppliers/dto/supplier.dto';
import { CreateProductDto } from '../src/products/dto/product.dto';
import { CreateCustomerDto } from '../src/customers/dto/customer.dto';
import { CreateOrderDto } from '../src/orders/dto/order.dto';
import { OrderStatus } from '../src/orders/order.entity';

describe('Dropshipping Management System (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: number;
  let supplierId: number;
  let productId: number;
  let customerId: number;
  let orderId: number;
  const testEmail = `test${Date.now()}@example.com`;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'your-secret-key';
    // Delete the database file to ensure clean state
    const dbPath = path.join(__dirname, '../dropshipping.db');
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication', () => {
    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: testEmail,
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('user');
          authToken = res.body.access_token;
          userId = res.body.user.id;
        });
    });

    it('should login with registered user', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testEmail,
          password: 'password123',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          authToken = res.body.access_token;
        });
    });
  });

  describe('Suppliers', () => {
    it('should create a supplier', () => {
      const createSupplierDto: CreateSupplierDto = {
        name: 'Test Supplier',
        email: 'supplier@example.com',
        phone: '+1234567890',
        address: '123 Supplier St',
        website: 'https://supplier.com',
        notes: 'Test supplier notes',
        isActive: true,
      };

      return request(app.getHttpServer())
        .post('/suppliers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createSupplierDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe(createSupplierDto.name);
          supplierId = res.body.id;
        });
    });

    it('should get all suppliers', () => {
      return request(app.getHttpServer())
        .get('/suppliers')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('should get supplier by id', () => {
      return request(app.getHttpServer())
        .get(`/suppliers/${supplierId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(supplierId);
          expect(res.body.name).toBe('Test Supplier');
        });
    });

    it('should update supplier', () => {
      return request(app.getHttpServer())
        .patch(`/suppliers/${supplierId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Test Supplier',
          phone: '+0987654321',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('Updated Test Supplier');
          expect(res.body.phone).toBe('+0987654321');
        });
    });
  });

  describe('Products', () => {
    it('should create a product', () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        description: 'A test product description',
        sku: 'TEST-SKU-001',
        price: 99.99,
        cost: 50.00,
        stock: 100,
        category: 'Electronics',
        supplierId: supplierId,
        imageUrl: 'https://example.com/image.jpg',
        isActive: true,
      };

      return request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createProductDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe(createProductDto.name);
          productId = res.body.id;
        });
    });

    it('should get all products', () => {
      return request(app.getHttpServer())
        .get('/products')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('should get product by id', () => {
      return request(app.getHttpServer())
        .get(`/products/${productId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(productId);
          expect(res.body.name).toBe('Test Product');
        });
    });

    it('should update product', () => {
      return request(app.getHttpServer())
        .patch(`/products/${productId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Test Product',
          price: 149.99,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('Updated Test Product');
          expect(res.body.price).toBe(149.99);
        });
    });

    it('should update product stock', () => {
      return request(app.getHttpServer())
        .patch(`/products/${productId}/stock`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ quantity: 50 })
        .expect(200)
        .expect((res) => {
          expect(res.body.stock).toBe(50);
        });
    });
  });

  describe('Customers', () => {
    it('should create a customer', () => {
      const createCustomerDto: CreateCustomerDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        address: '123 Customer St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        notes: 'Test customer',
        isActive: true,
      };

      return request(app.getHttpServer())
        .post('/customers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createCustomerDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.firstName).toBe(createCustomerDto.firstName);
          customerId = res.body.id;
        });
    });

    it('should get all customers', () => {
      return request(app.getHttpServer())
        .get('/customers')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('should get customer by id', () => {
      return request(app.getHttpServer())
        .get(`/customers/${customerId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(customerId);
          expect(res.body.firstName).toBe('John');
        });
    });

    it('should update customer', () => {
      return request(app.getHttpServer())
        .patch(`/customers/${customerId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          firstName: 'Jane',
          phone: '+0987654321',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.firstName).toBe('Jane');
          expect(res.body.phone).toBe('+0987654321');
        });
    });
  });

  describe('Orders', () => {
    it('should create an order', () => {
      const createOrderDto: CreateOrderDto = {
        userId: userId,
        totalAmount: 149.99,
        shippingAddress: '123 Shipping St, New York, NY 10001',
        notes: 'Test order',
        orderItems: [
          {
            productId: productId,
            quantity: 1,
            price: 149.99,
          },
        ],
      };

      return request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createOrderDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.totalAmount).toBe(createOrderDto.totalAmount);
          orderId = res.body.id;
        });
    });

    it('should get all orders', () => {
      return request(app.getHttpServer())
        .get('/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('should get order by id', () => {
      return request(app.getHttpServer())
        .get(`/orders/${orderId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(orderId);
          expect(res.body.status).toBe(OrderStatus.PENDING);
        });
    });

    it('should update order status', () => {
      return request(app.getHttpServer())
        .patch(`/orders/${orderId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: OrderStatus.CONFIRMED,
          trackingNumber: 'TRACK123456',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe(OrderStatus.CONFIRMED);
          expect(res.body.trackingNumber).toBe('TRACK123456');
        });
    });
  });

  describe('Reports', () => {
    it('should get dashboard report', () => {
      return request(app.getHttpServer())
        .get('/reports/dashboard')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('totalProducts');
          expect(res.body).toHaveProperty('totalOrders');
          expect(res.body).toHaveProperty('totalRevenue');
        });
    });

    it('should get sales report', () => {
      return request(app.getHttpServer())
        .get('/reports/sales')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });

    it('should get inventory report', () => {
      return request(app.getHttpServer())
        .get('/reports/inventory')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });

  describe('Notifications', () => {
    it('should get alerts', () => {
      return request(app.getHttpServer())
        .get('/notifications/alerts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should get low stock alerts', () => {
      return request(app.getHttpServer())
        .get('/notifications/low-stock')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });

  describe('Seeder', () => {
    it('should seed demo data', () => {
      return request(app.getHttpServer())
        .post('/seeder/seed-demo-data')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
        });
    });
  });

  describe('Error Handling', () => {
    it('should return 401 for unauthorized access', () => {
      return request(app.getHttpServer())
        .get('/products')
        .expect(401);
    });

    it('should return 404 for non-existent resource', () => {
      return request(app.getHttpServer())
        .get('/products/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 400 for invalid data', () => {
      return request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '',
          description: 'Test',
          sku: 'TEST',
          price: -10,
          cost: 5,
          category: 'Test',
          supplierId: supplierId,
        })
        .expect(400);
    });
  });
});