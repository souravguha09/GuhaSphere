# API reference

Local base URL: `http://localhost:5000/api`

## Authentication

Register:

```http
POST /auth/register
Content-Type: application/json

{ "name": "Aarav", "email": "aarav@example.com", "password": "replace-with-a-strong-password" }
```

Login:

```http
POST /auth/login
Content-Type: application/json

{ "email": "aarav@example.com", "password": "replace-with-a-strong-password" }
```

Both return `{ "token": "...", "user": { ... } }`. Send the token on protected routes:

```http
Authorization: Bearer <token>
```

## Product catalogue

```http
GET /products?q=linen&category=Clothing&gender=Women&size=M&minPrice=500&maxPrice=2500&sort=price_low&page=1&limit=24
```

Supported sort values: `featured`, `newest`, `price_low`, `price_high`, `rating`, `discount`.

## Place an order

```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    { "productId": "<mongo-product-id>", "quantity": 1, "size": "M", "color": "Black" }
  ],
  "shippingAddress": {
    "name": "Aarav Sharma",
    "phone": "9876543210",
    "line1": "10 Example Road",
    "line2": "Near the park",
    "city": "Kolkata",
    "state": "West Bengal",
    "postalCode": "700001"
  },
  "paymentMethod": "COD",
  "couponCode": "SPHERE10"
}
```

Valid payment methods in this demo are `COD` and `DEMO`. `DEMO` marks the order as prepaid for local UI testing only; it does not collect money. The sample promo code `SPHERE10` gives 10% off the item subtotal on orders of ₹999 or more. Prices, discount eligibility and delivery fees are calculated by the API from current database product prices.

## Admin operations

Use a token belonging to a user with `role: "admin"`.

```http
POST /products
PATCH /products/:id
DELETE /products/:id
GET /orders
PATCH /orders/:id/status
```

Allowed order status updates: `Confirmed`, `Packed`, `Shipped`, `Delivered`, `Cancelled`.

The sample seed script can create an initial local admin account when `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` are configured in `server/.env`. Do not use a sample credential in a deployed environment.
