# 📄 INSTRUCTION.md

## 📝 Vendor Service

**Base URL:** `http://localhost:3001/api/vendorA`

These service use Mongo DB Atlas

### 🔗 API Endpoints

1. **Fetch all items**
   - **Endpoint:** `GET /items`
   - **Example Request:**
     ```
     http://localhost:3001/api/vendorA/items
     ```

2. **Fetch item details**
   - **Endpoint:** `GET /items/{itemId}`
   - **Example Request:**
     ```
     http://localhost:3001/api/vendorA/items/5
     ```

3. **Update item stock**
   - **Endpoint:** `POST /item-stock-update`
   - **Payload:**
     ```json
     {
       "productId": "685aeb2c4c6a72dced04de80",
       "qty": 5
     }
     ```

---

## 📝 Stock Aggregator Service

**Base URL:** `http://localhost:3000`

### 🔗 API Endpoints

1. **Sync products from vendor**
   - **Endpoint:** `GET /products`
   - **Example Request:**
     ```
     http://localhost:3000/products
     ```

2. **Place order**
   - **Endpoint:** `POST /order/place-order`
   - **Payload:**
     ```json
     {
       "products": [
         { "productId": "5", "qty": 10, "price": 100 },
         { "productId": "6", "qty": 5, "price": 150 }
       ]
     }
     ```

---

## 🐇 RabbitMQ Integration

### 🔧 RabbitMQ Docker Service

Add the following to your `docker-compose.yml` to run RabbitMQ:

```yaml
version: "3.9"

services:
  rabbitmq:
    image: rabbitmq:3-management
    container_name: rabbitmq
    restart: always
    ports:
      - "5672:5672"     # AMQP protocol
      - "15672:15672"   # Management UI
    environment:
      RABBITMQ_DEFAULT_USER: guest
      RABBITMQ_DEFAULT_PASS: guest
