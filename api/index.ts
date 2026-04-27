import express from 'express';

const app = express();
app.use(express.json());

// --- MOCK DATABASE ---
let products = [
  {
    id: "1",
    name: "Phantom Black Chronograph",
    price: 12500,
    description: "A statement of timeless elegance and precision engineering.",
    category: "Watches",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=1000",
    stock: 5
  },
  {
    id: "2",
    name: "Aurum Velvet Evening Gown",
    price: 8900,
    description: "Hand-stitched velvet with subtle gold embroidery for unforgettable nights.",
    category: "Apparel",
    image: "https://images.unsplash.com/photo-1539109132332-629ee6280821?auto=format&fit=crop&q=80&w=1000",
    stock: 3
  },
  {
    id: "3",
    name: "Onyx Essence Parfum",
    price: 3200,
    description: "A deep, mysterious fragrance with notes of oud and spiced amber.",
    category: "Fragrance",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=1000",
    stock: 12
  },
  {
    id: "4",
    name: "Platinum Diamond Cuff",
    price: 24500,
    description: "Solid platinum studded with VS1 diamonds for an unmistakable signature.",
    category: "Jewelry",
    image: "https://images.unsplash.com/photo-1599643478524-fb66f7ca1950?auto=format&fit=crop&q=80&w=1000",
    stock: 2
  },
  {
    id: "5",
    name: "Equestrian Leather Tote",
    price: 4200,
    description: "Full-grain Italian leather hand-stitched tote bag.",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=1000",
    stock: 8
  },
  {
    id: "6",
    name: "Monarch Fountain Pen",
    price: 1850,
    description: "18k gold nib with obsidian barrel.",
    category: "Writing",
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=1000",
    stock: 15
  }
];

let orders: any[] = [
  { id: "ORD-9281", items: [], total: 12500, status: "delivered", customerName: "Julian Vane", customerEmail: "julian@vane.com", createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "ORD-1152", items: [], total: 3200, status: "pending", customerName: "Elena Rossi", customerEmail: "elena@rossi.it", createdAt: new Date(Date.now() - 3600000).toISOString() }
];

let users: any[] = [
  { id: "admin", email: "admin@luxevault.com", role: "admin", name: "Executive Admin" }
];

// --- API ROUTES ---
app.get("/api/products", (req, res) => {
  res.json(products);
});

app.post("/api/products", (req, res) => {
  const newProduct = { ...req.body, id: Date.now().toString() };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.put("/api/products/:id", (req, res) => {
  products = products.map(p => p.id === req.params.id ? { ...p, ...req.body } : p);
  res.json({ message: "Product updated" });
});

app.delete("/api/products/:id", (req, res) => {
  products = products.filter(p => p.id !== req.params.id);
  res.json({ message: "Product deleted" });
});

app.get("/api/orders", (req, res) => {
  res.json(orders);
});

app.post("/api/orders", (req, res) => {
  const newOrder = { 
    ...req.body, 
    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    status: "pending"
  };
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

app.patch("/api/orders/:id", (req, res) => {
  orders = orders.map(o => o.id === req.params.id ? { ...o, status: req.body.status } : o);
  res.json({ message: "Order status updated" });
});

app.get("/api/stats", (req, res) => {
  const totalSales = orders.reduce((acc, curr) => acc + curr.total, 0);
  const orderCount = orders.length;
  const productCount = products.length;
  res.json({ totalSales, orderCount, productCount });
});

export default app;
