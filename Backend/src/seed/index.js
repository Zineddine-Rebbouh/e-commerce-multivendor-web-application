/**
 * Seed script for the MERN e-commerce backend.
 *
 * Reads the real schema from the application's Mongoose models (no assumptions),
 * then inserts a realistic dataset covering the main e-commerce workflows.
 *
 * Usage (from Backend/):
 *   npm run seed          # insert data, skipping records that already exist
 *   npm run seed:reset    # wipe the seeded collections, then re-insert
 *
 * Idempotent: every record is looked up by a natural key before insert, so
 * re-running never creates uncontrolled duplicates. Passwords are hashed with
 * bcrypt exactly like `authController.register`.
 */

const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
require("dotenv").config()

const User = require("../models/User")
const Shop = require("../models/Shop")
const Category = require("../models/Category")
const Discount = require("../models/Discount")
const Product = require("../models/Product")
const Order = require("../models/Order")
const LineOrderItems = require("../models/LineOrderItems")
const ShippingAdresse = require("../models/ShippingAdresse")
const Cart = require("../models/Cart")
const LineCartItems = require("../models/LineCartItems")
const Whishlist = require("../models/Whishlist")
const Review = require("../models/Review")
const Notification = require("../models/Notification")
const RequestShopDetails = require("../models/RequestShopDetails")
const Requests = require("../models/Requests")
const Reports = require("../models/Reports")
const Event = require("../models/Events")

const RESET = process.argv.includes("--reset")

const MODELS = [
  User, Shop, Category, Discount, Product, Order, LineOrderItems,
  ShippingAdresse, Cart, LineCartItems, Whishlist, Review, Notification,
  RequestShopDetails, Requests, Reports, Event,
]

// Days/milliseconds helpers so createdAt/deliverDate are logically ordered.
const DAY = 24 * 60 * 60 * 1000
const daysAgo = n => new Date(Date.now() - n * DAY)
const daysFrom = (date, n) => new Date(date.getTime() + n * DAY)

// Find an existing doc by a natural-key filter; otherwise create it.
const upsert = async (Model, where, data) => {
  const existing = await Model.findOne(where)
  if (existing) return existing
  return Model.create(data)
}

// Hash passwords the same way the app does (bcrypt, salt rounds 10).
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

const img = text => `https://placehold.co/600x400?text=${encodeURIComponent(text)}`
const avatar = text => `https://placehold.co/200x200?text=${encodeURIComponent(text)}`

async function main() {
  const uri = process.env.MONGO_URI
  if (!uri) {
    console.error("MONGO_URI is not set. Add it to Backend/.env first.")
    process.exit(1)
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 })
  console.log(`Connected: ${mongoose.connection.host}/${mongoose.connection.name}`)

  if (RESET) {
    for (const Model of MODELS) {
      await Model.collection.deleteMany({})
    }
    console.log("Reset: wiped all seeded collections.\n")
  }

  const counts = {}

  // ---------------------------------------------------------------- Users
  const COMMON_PASSWORD = "Password@123"
  const hashed = await hashPassword(COMMON_PASSWORD)

  const userDefs = [
    // Admins
    { name: "Admin One", email: "admin@example.com", phoneNumber: "+1 555 010 0001", role: "Admin" },
    { name: "System Admin", email: "system.admin@example.com", phoneNumber: "+1 555 010 0002", role: "Admin" },
    // Sellers (each owns a shop)
    { name: "Ahmed Benali", email: "ahmed.benali@gmail.com", phoneNumber: "+213 551 12 34 56", role: "Seller", key: "ahmed" },
    { name: "Sofia Mansouri", email: "sofia.mansouri@gmail.com", phoneNumber: "+213 552 23 45 67", role: "Seller", key: "sofia" },
    { name: "Karim Haddadi", email: "karim.haddadi@gmail.com", phoneNumber: "+213 553 34 56 78", role: "Seller", key: "karim" },
    { name: "Nour Djellaoui", email: "nour.djellaoui@gmail.com", phoneNumber: "+213 554 45 67 89", role: "Seller", key: "nour" },
    // Customers
    { name: "Lina Boudiaf", email: "lina.boudiaf@gmail.com", phoneNumber: "+213 560 12 34 78", role: "Customer", key: "lina" },
    { name: "Omar Zeddam", email: "omar.zeddam@gmail.com", phoneNumber: "+213 561 23 45 89", role: "Customer", key: "omar" },
    { name: "Yacine Meziane", email: "yacine.meziane@gmail.com", phoneNumber: "+213 562 34 56 90", role: "Customer", key: "yacine" },
    { name: "Amel Saidi", email: "amel.saidi@gmail.com", phoneNumber: "+213 563 45 67 01", role: "Customer", key: "amel" },
    { name: "Rania Cherif", email: "rania.cherif@gmail.com", phoneNumber: "+213 564 56 78 12", role: "Customer", key: "rania" },
    { name: "Mehdi Touhami", email: "mehdi.touhami@gmail.com", phoneNumber: "+213 565 67 89 23", role: "Customer", key: "mehdi" },
    { name: "Nadia Belkacem", email: "nadia.belkacem@gmail.com", phoneNumber: "+213 566 78 90 34", role: "Customer", key: "nadia" },
  ]

  const users = {}
  for (const def of userDefs) {
    const user = await upsert(
      User,
      { email: def.email },
      {
        name: def.name,
        email: def.email,
        password: hashed,
        phoneNumber: def.phoneNumber,
        role: def.role,
        avatar: avatar(def.name),
      }
    )
    users[def.key || def.email] = user
  }
  counts.users = await User.countDocuments()

  // ---------------------------------------------------------------- Categories
  const categoryDefs = [
    { name: "Electronics", image: img("Electronics"), description: "Phones, audio, wearables and smart home gadgets." },
    { name: "Fashion & Clothing", image: img("Fashion"), description: "Apparel, shoes and accessories for every season." },
    { name: "Sports & Outdoors", image: img("Sports"), description: "Training gear, camping and outdoor equipment." },
    { name: "Home & Kitchen", image: img("HomeKitchen"), description: "Appliances, cookware and everyday home goods." },
    { name: "Beauty & Health", image: img("Beauty"), description: "Skincare, personal care and wellness essentials." },
    { name: "Books & Stationery", image: img("Books"), description: "Bestsellers, classics and study supplies." },
  ]
  const categories = {}
  for (const def of categoryDefs) {
    const cat = await upsert(Category, { name: def.name }, def)
    categories[def.name] = cat
  }
  counts.categories = await Category.countDocuments()

  // ---------------------------------------------------------------- Discounts
  const discountDefs = [
    { rate: 20, start: "2026-01-01", end: "2026-12-31" },
    { rate: 15, start: "2026-01-01", end: "2026-12-31" },
    { rate: 30, start: "2026-03-01", end: "2026-09-30" },
    { rate: 10, start: "2026-02-01", end: "2026-08-31" },
    { rate: 25, start: "2026-03-15", end: "2026-10-15" },
    { rate: 40, start: "2024-01-01", end: "2024-06-30" }, // expired, not attached
  ]
  const discounts = {}
  for (const def of discountDefs) {
    const d = await upsert(
      Discount,
      { discount_rate: def.rate, start_date: def.start, end_date: def.end },
      { discount_rate: def.rate, start_date: def.start, end_date: def.end }
    )
    discounts[def.rate] = d
  }
  counts.discounts = await Discount.countDocuments()

  // ---------------------------------------------------------------- Shops
  const shopDefs = [
    { key: "ahmed", name: "TechNova Digital", address: "12 Rue Didouche Mourad, Algiers", zipCode: 16000 },
    { key: "sofia", name: "Elégance Fashion", address: "8 Avenue de l'Indépendance, Oran", zipCode: 31000 },
    { key: "karim", name: "Urban Athletics", address: "25 Boulevard Zighout Youcef, Constantine", zipCode: 25000 },
    { key: "nour", name: "Maison & Lumière", address: "3 Rue Emir Abdelkader, Sétif", zipCode: 19000 },
  ]
  const shops = {}
  for (const def of shopDefs) {
    const owner = users[def.key]
    const shop = await upsert(
      Shop,
      { userId: owner._id },
      {
        name: def.name,
        userId: owner._id,
        email: owner.email,
        description: `${def.name} — a curated online store on the marketplace.`,
        address: def.address,
        phoneNumber: owner.phoneNumber,
        zipCode: def.zipCode,
        avatar: avatar(def.name),
      }
    )
    shops[def.key] = shop
    if (owner.role !== "Seller" || String(owner.shopId) !== String(shop._id)) {
      owner.role = "Seller"
      owner.shopId = shop._id
      await owner.save()
    }
  }
  counts.shops = await Shop.countDocuments()

  // ---------------------------------------------------------------- Products
  // Each product lists: natural data, base initial stock, and a base rating
  // override (recomputed below from seeded reviews when present).
  const productDefs = [
    // TechNova Digital (Ahmed)
    { key: "P1", name: "Wireless Noise-Canceling Headphones Pro X", cat: "Electronics", shop: "ahmed", brands: ["Sony", "JBL"], price: 249.99, base: 25, discount: 20 },
    { key: "P2", name: "4K Ultra HD Smart TV - 55 Inch", cat: "Electronics", shop: "ahmed", brands: ["Samsung", "LG"], price: 699.99, base: 12, discount: 15 },
    { key: "P3", name: "USB-C Fast Charger 65W Gallium", cat: "Electronics", shop: "ahmed", brands: ["Anker", "UGREEN"], price: 29.99, base: 500 },
    { key: "P4", name: "Mechanical Keyboard RGB - TKL", cat: "Electronics", shop: "ahmed", brands: ["Logitech", "Razer"], price: 89.99, base: 45, discount: 10 },
    { key: "P5", name: "Portable Bluetooth Speaker", cat: "Electronics", shop: "ahmed", brands: ["JBL", "Sony"], price: 59.99, base: 3 },
    { key: "P6", name: "Smartphone 256GB Dual SIM - Midnight", cat: "Electronics", shop: "ahmed", brands: ["Samsung", "Xiaomi"], price: 899.99, base: 4, discount: 20 },
    { key: "P7", name: "Smartwatch Fitness Band - 2026 Edition", cat: "Electronics", shop: "ahmed", brands: ["Garmin", "Apple"], price: 159.99, base: 10 },
    // Elégance Fashion (Sofia)
    { key: "F1", name: "Classic Denim Jacket - Unisex", cat: "Fashion & Clothing", shop: "sofia", brands: ["Levi's", "Wrangler"], price: 69.99, base: 60, discount: 25 },
    { key: "F2", name: "Slim Fit Chino Trousers", cat: "Fashion & Clothing", shop: "sofia", brands: ["H&M", "Zara"], price: 45.99, base: 80 },
    { key: "F3", name: "Leather Chelsea Boots", cat: "Fashion & Clothing", shop: "sofia", brands: ["Clarks", "Timberland"], price: 129.99, base: 20, discount: 30 },
    { key: "F4", name: "Cotton Crew Neck T-Shirt (3-Pack)", cat: "Fashion & Clothing", shop: "sofia", brands: ["Uniqlo", "GAP"], price: 34.99, base: 200 },
    // Urban Athletics (Karim)
    { key: "S1", name: "Running Shoes - Lightweight Cushioning", cat: "Sports & Outdoors", shop: "karim", brands: ["Nike", "Adidas", "Puma"], price: 119.99, base: 35, discount: 20 },
    { key: "S2", name: "Fitness Resistance Bands Set", cat: "Sports & Outdoors", shop: "karim", brands: ["FitSimplify", "Lifeline"], price: 24.99, base: 8 },
    { key: "S3", name: "Insulated Water Bottle 1L", cat: "Sports & Outdoors", shop: "karim", brands: ["Hydro Flask", "Yeti"], price: 19.99, base: 150 },
    { key: "S4", name: "Camping Tent - 4 Person", cat: "Sports & Outdoors", shop: "karim", brands: ["Coleman", "Quechua"], price: 189.99, base: 4, discount: 15 },
    { key: "S5", name: "Yoga Mat Non-Slip 6mm", cat: "Sports & Outdoors", shop: "karim", brands: ["Liforme", "Manduka"], price: 29.99, base: 90 },
    // Maison & Lumière (Nour)
    { key: "H1", name: "Ceramic Non-Stick Cookware Set (12 pc)", cat: "Home & Kitchen", shop: "nour", brands: ["T-fal", "Cuisinart"], price: 139.99, base: 22, discount: 20 },
    { key: "H2", name: "Memory Foam Pillow - Cooling Gel", cat: "Home & Kitchen", shop: "nour", brands: ["Tempur", "Sleep Innovations"], price: 39.99, base: 60 },
    { key: "H3", name: "Espresso Machine 15 Bar", cat: "Home & Kitchen", shop: "nour", brands: ["DeLonghi", "Breville"], price: 299.99, base: 5, discount: 10 },
    { key: "Bt1", name: "Essential Face Moisturizer 50ml", cat: "Beauty & Health", shop: "nour", brands: ["CeraVe", "La Roche-Posay"], price: 21.99, base: 120 },
    { key: "Bt2", name: "Sunscreen SPF 50+ 100ml", cat: "Beauty & Health", shop: "nour", brands: ["Neutrogena", "Eucerin"], price: 17.49, base: 3 },
    { key: "Bk1", name: "Atomic Habits (Paperback)", cat: "Books & Stationery", shop: "nour", brands: ["Penguin", "Random House"], price: 14.99, base: 300, discount: 15 },
    { key: "Bk2", name: "A Brief History of Time (Illustrated)", cat: "Books & Stationery", shop: "nour", brands: ["Bantam", "Vintage"], price: 24.99, base: 45 },
  ]

  const products = {}
  for (const def of productDefs) {
    const shop = shops[def.shop]
    const cat = categories[def.cat]
    const data = {
      name: def.name,
      categoryId: cat._id,
      shopId: shop._id,
      Brands: def.brands,
      image: { url: img(def.name) },
      description: `${def.name}. High-quality ${cat.name.toLowerCase()} product sold by ${shop.name}. Ships worldwide.`,
      price: def.price,
      available_quantity: def.base,
      isHavingDiscount: !!def.discount,
      total_sell: 0,
    }
    if (def.discount) data.discountId = discounts[def.discount]._id
    const product = await upsert(Product, { name: def.name, shopId: shop._id }, data)
    products[def.key] = { doc: product, sold: 0, base: def.base }
  }
  counts.products = await Product.countDocuments()

  // ---------------------------------------------------------------- Orders
  // orderDefs: status, owner, createdAt offset, shipping, items (productKey -> qty).
  const orderDefs = [
    { key: "A", user: "yacine", status: "Delivered", days: 30, ship: 12.99, items: { P1: 2, F1: 1, S1: 1 } },
    { key: "B", user: "amel", status: "Shipped", days: 4, ship: 5.99, items: { P3: 1, F4: 2, H2: 1 } },
    { key: "C", user: "amel", status: "Delivered", days: 60, ship: 5.99, items: { P4: 1, K1: 1, Bk1: 2, S3: 1 } },
    { key: "D", user: "rania", status: "Processing", days: 2, ship: 5.99, items: { Bt1: 1, F2: 1 } },
    { key: "E", user: "rania", status: "Refunded", days: 3, ship: 12.99, items: { P2: 1 } },
    { key: "L", user: "rania", status: "Shipped", days: 5, ship: 5.99, items: { F2: 1, S3: 1, Bk1: 1 } },
    { key: "F", user: "mehdi", status: "Cancelled", days: 10, ship: 5.99, items: { P5: 1, Bt2: 1 } },
    { key: "G", user: "mehdi", status: "Returned", days: 5, ship: 5.99, items: { S2: 1, Bk2: 1 } },
    { key: "H", user: "nadia", status: "Delivered", days: 20, ship: 12.99, items: { P6: 4, H1: 2 } },
    { key: "I", user: "nadia", status: "Delivered", days: 40, ship: 5.99, items: { F3: 1, S1: 1, Bt1: 2, Bk1: 1 } },
    { key: "J", user: "amel", status: "Pending", days: 1, ship: 12.99, items: { P1: 1, S4: 1 } },
    { key: "K", user: "amel", status: "On Hold", days: 1, ship: 5.99, items: { P3: 2, Bt1: 1 } },
  ]

  // Extra kitchen appliance sold by TechNova (referenced by order C as K1Q).
  const slowCooker = await upsert(
    Product,
    { name: "Smart Slow Cooker with App Control", shopId: shops.ahmed._id },
    {
      name: "Smart Slow Cooker with App Control",
      categoryId: categories["Home & Kitchen"]._id,
      shopId: shops.ahmed._id,
      Brands: ["KitchenAid", "Ninja"],
      image: { url: img("SlowCooker") },
      description: "App-controlled slow cooker from TechNova Digital with preset cooking programs.",
      price: 119.99,
      available_quantity: 14,
      isHavingDiscount: true,
      discountId: discounts[15]._id,
      total_sell: 0,
    }
  )
  products.K1 = { doc: slowCooker, sold: 0, base: 14 }

  const ordersById = {}

  const shippingDefs = [
    { street: "1241 Market Street", city: "San Francisco", state: "CA", postalCode: "94103", country: "US" },
    { street: "45 Lexington Ave", city: "New York", state: "NY", postalCode: "10017", country: "US" },
    { street: "22 Rua Augusta", city: "Lisbon", state: "Lisboa", postalCode: "1100-048", country: "PT" },
    { street: "8 Karl-Marx-Allee", city: "Berlin", state: "Berlin", postalCode: "10178", country: "DE" },
    { street: "9 Chemin de Bellevue", city: "Lyon", state: "Auvergne-Rhône-Alpes", postalCode: "69003", country: "FR" },
  ]
  const shippingByOrder = {}
  for (const def of shippingDefs) {
    const addr = await upsert(
      ShippingAdresse,
      { street: def.street, city: def.city, postalCode: def.postalCode, country: def.country, state: def.state },
      def
    )
    shippingByOrder[`${def.city}`] = addr
  }
  // Reuse a small pool of addresses per order deterministically.
  const addrPool = Object.values(shippingByOrder)

  for (let i = 0; i < orderDefs.length; i++) {
    const def = orderDefs[i]
    const user = users[def.user]
    const createdAt = daysAgo(def.days)

    let subtotal = 0
    for (const [pkey, qty] of Object.entries(def.items)) {
      const p = products[pkey].doc
      subtotal += p.price * qty
    }
    const totalPrice = Math.round((subtotal + def.ship) * 100) / 100
    const paymentId = `pi_seed_${def.key}_${def.user}`

    const order = await upsert(
      Order,
      { "paymentResult.id": paymentId },
      {
        userId: user._id,
        shippingAddress: addrPool[i % addrPool.length]._id,
        paymentMethod: "card",
        paymentResult: {
          id: paymentId,
          status: "paid",
          update_time: createdAt.toISOString(),
          email_address: user.email,
        },
        shippingPrice: def.ship,
        totalPrice,
        status: def.status,
        createdAt,
        deliverDate:
          def.status === "Delivered" || def.status === "Shipped"
            ? daysFrom(createdAt, 6)
            : null,
      }
    )

    for (const [pkey, qty] of Object.entries(def.items)) {
      const p = products[pkey].doc
      await LineOrderItems.findOneAndUpdate(
        { orderId: order._id, productId: p._id },
        { orderId: order._id, productId: p._id, quantity: qty },
        { upsert: true, new: true }
      )
    }

    ordersById[def.key] = order
  }
  counts.orders = await Order.countDocuments()
  counts.lineOrderItems = await LineOrderItems.countDocuments()
  counts.shippingAdresses = await ShippingAdresse.countDocuments()

  // --------------------------------------------------------- Recompute stock / total_sell and shop
  // balances from the persisted line items (idempotent regardless of reruns).
  const soldMap = {} // productId -> qty
  for (const item of await LineOrderItems.find({})) {
    soldMap[String(item.productId)] = (soldMap[String(item.productId)] || 0) + item.quantity
  }

  for (const key of Object.keys(products)) {
    const p = products[key]
    const sold = soldMap[String(p.doc._id)] || 0
    const remaining = Math.max(0, p.base - sold)
    await Product.updateOne(
      { _id: p.doc._id },
      { $set: { available_quantity: remaining, total_sell: sold } }
    )
  }

  const shopCredits = {} // shopId -> { total, orderIds: Set }
  for (const item of await LineOrderItems.find({}).populate("productId")) {
    const shopId = String(item.productId.shopId)
    if (!shopCredits[shopId]) shopCredits[shopId] = { total: 0, orderIds: new Set() }
    shopCredits[shopId].total += item.productId.price * item.quantity
    shopCredits[shopId].orderIds.add(String(item.orderId))
  }

  for (const shop of await Shop.find({})) {
    const credit = shopCredits[String(shop._id)]
    if (!credit) continue
    await Shop.updateOne(
      { _id: shop._id },
      {
        $set: { Balance: Math.round(credit.total * 100) / 100 },
        $addToSet: { transections: { $each: [...credit.orderIds] } },
      }
    )
  }
  counts.products = await Product.countDocuments()

  // ---------------------------------------------------------------- Carts & cart items
  for (const def of userDefs) {
    const u = users[def.key || def.email]
    await upsert(Cart, { userId: u._id }, { userId: u._id })
  }
  counts.carts = await Cart.countDocuments()

  const cartItemDefs = {
    lina: [{ P3: 2 }, { F4: 1 }],
    amel: [{ P1: 1 }, { Bt1: 1 }, { Bk1: 2 }],
    rania: [{ F2: 1 }, { S3: 1 }],
    nadia: [{ P2: 1 }, { H1: 1 }],
  }
  let cartItemsCreated = 0
  for (const [userKey, items] of Object.entries(cartItemDefs)) {
    const cart = await Cart.findOne({ userId: users[userKey]._id })
    for (const item of items) {
      const [pkey, qty] = Object.entries(item)[0]
      await upsert(
        LineCartItems,
        { cartId: cart._id, productId: products[pkey].doc._id },
        { cartId: cart._id, productId: products[pkey].doc._id, quantity: qty }
      )
      cartItemsCreated++
    }
  }
  counts.lineCartItems = await LineCartItems.countDocuments()

  // ---------------------------------------------------------------- Wishlists
  const wishlistDefs = {
    lina: ["P1", "F3"],
    rania: ["P4"],
    mehdi: ["S1", "H3"],
    nadia: ["P3"],
  }
  let wishlistCreated = 0
  for (const [userKey, keys] of Object.entries(wishlistDefs)) {
    for (const pkey of keys) {
      await upsert(
        Whishlist,
        { userId: users[userKey]._id, productId: products[pkey].doc._id },
        { userId: users[userKey]._id, productId: products[pkey].doc._id }
      )
      wishlistCreated++
    }
  }
  counts.wishlist = await Whishlist.countDocuments()

  // ---------------------------------------------------------------- Reviews
  const reviewDefs = [
    { user: "yacine", product: "P1", rating: 5, comment: "Excellent noise cancelling, battery lasts two days straight." },
    { user: "yacine", product: "F1", rating: 4, comment: "Great fit and thick denim, true to size." },
    { user: "yacine", product: "S1", rating: 4, comment: "Very comfortable for daily runs." },
    { user: "amel", product: "P3", rating: 5, comment: "Charges my phone and laptop at full speed." },
    { user: "amel", product: "F4", rating: 4, comment: "Soft cotton, decent quality for the price." },
    { user: "amel", product: "Bk1", rating: 5, comment: "A quick, motivating read. Highly recommend." },
    { user: "amel", product: "P4", rating: 3, comment: "Good keys but a bit loud for the office." },
    { user: "amel", product: "S4", rating: 4, comment: "Spacious tent, easy to set up." },
    { user: "amel", product: "H2", rating: 4, comment: "Cooling effect is real, neck pain improved." },
    { user: "amel", product: "K1", rating: 4, comment: "Set and forget cooking, meals come out great." },
    { user: "rania", product: "P2", rating: 2, comment: "Panel had a faint backlight bleed, seller handled it." },
    { user: "rania", product: "Bt1", rating: 4, comment: "Lightweight moisturizer, no greasy finish." },
    { user: "rania", product: "S3", rating: 5, comment: "Keeps water cold all day, cap is leak-proof." },
    { user: "rania", product: "Bk1", rating: 4, comment: "Well packaged, arrived on time." },
    { user: "mehdi", product: "P5", rating: 3, comment: "Decent sound for a small speaker." },
    { user: "mehdi", product: "S2", rating: 4, comment: "Good resistance for home workouts." },
    { user: "mehdi", product: "Bk2", rating: 5, comment: "Beautiful illustrated edition, hard to put down." },
    { user: "nadia", product: "P6", rating: 5, comment: "Flagship camera quality, fast and smooth." },
    { user: "nadia", product: "H1", rating: 4, comment: "Non-stick holds up well, easy to clean." },
    { user: "nadia", product: "F3", rating: 5, comment: "Premium leather, comfortable out of the box." },
    { user: "nadia", product: "Bt1", rating: 5, comment: "Repurchased three times, perfect for dry skin." },
    { user: "nadia", product: "Bk1", rating: 5, comment: "Bought copies as gifts, everyone loved it." },
  ]

  const ratings = {} // productKey -> [ratings]
  for (const def of reviewDefs) {
    await upsert(
      Review,
      { userId: users[def.user]._id, productId: products[def.product].doc._id },
      {
        userId: users[def.user]._id,
        productId: products[def.product].doc._id,
        rating: def.rating,
        comment: def.comment,
        screenshots: [],
      }
    )
    ;(ratings[def.product] = ratings[def.product] || []).push(def.rating)
  }
  counts.reviews = await Review.countDocuments()

  for (const [pkey, list] of Object.entries(ratings)) {
    const avg = list.reduce((s, r) => s + r, 0) / list.length
    const rounded = Math.round(avg * 10) / 10
    await Product.updateOne({ _id: products[pkey].doc._id }, { $set: { rating: rounded } })
  }

  // ---------------------------------------------------------------- Notifications
  const notifDefs = [
    { user: "lina", type: "cartUpdate", message: "Your cart now contains 2 items.", read: false },
    { user: "lina", type: "wishlistUpdate", message: "An item on your wishlist is back in stock.", read: false },
    { user: "amel", type: "orderStatus", message: "Order J is pending payment confirmation.", read: false, order: "J" },
    { user: "amel", type: "promotion", message: "Spring sale: up to 30% off selected brands.", read: true },
    { user: "rania", type: "orderStatus", message: "Your order L has shipped.", read: false, order: "L" },
    { user: "rania", type: "shippingUpdate", message: "Order L is out for delivery.", read: false, order: "L" },
    { user: "mehdi", type: "accountActivity", message: "Password changed successfully.", read: true },
    { user: "nadia", type: "orderStatus", message: "Your order H has been delivered.", read: false, order: "H" },
    { user: "nadia", type: "recommendation", message: "New arrivals in Electronics you may like.", read: false, product: "P7" },
    { user: "yacine", type: "feedback", message: "Thanks for reviewing your recent purchase.", read: true },
  ]
  for (const def of notifDefs) {
    const data = {
      userId: users[def.user]._id,
      type: def.type,
      message: def.message,
      read: def.read,
    }
    if (def.order) data.orderId = ordersById[def.order]._id
    if (def.product) data.productId = products[def.product].doc._id
    await upsert(Notification, { userId: data.userId, type: data.type, message: data.message }, data)
  }
  counts.notifications = await Notification.countDocuments()

  // ---------------------------------------------------------------- Shop requests
  const requestDefs = [
    {
      user: "omar", status: "Pending",
      details: { name: "Gadget World", phoneNumber: "+213 561 23 45 89", email: "omar.zeddam@gmail.com", description: "Mobile phones and accessories store.", address: "14 Rue Frantz Fanon, Blida", zipCode: 9000 },
    },
    {
      user: "mehdi", status: "Rejected",
      details: { name: "Vintage Vinyl Lab", phoneNumber: "+213 565 67 89 23", email: "mehdi.touhami@gmail.com", description: "Rare records and turntables.", address: "2 Rue de la Liberté, Annaba", zipCode: 23000 },
    },
    {
      user: "nour", status: "Approved",
      details: { name: "Maison & Lumière", phoneNumber: "+213 554 45 67 89", email: "nour.djellaoui@gmail.com", description: "Home goods and decor.", address: "3 Rue Emir Abdelkader, Sétif", zipCode: 19000 },
    },
  ]
  for (const def of requestDefs) {
    const details = await upsert(
      RequestShopDetails,
      { email: def.details.email },
      def.details
    )
    await upsert(
      Requests,
      { userId: users[def.user]._id },
      { userId: users[def.user]._id, requestStatus: def.status, requestDetails: details._id }
    )
  }
  counts.requestShopDetails = await RequestShopDetails.countDocuments()
  counts.requests = await Requests.countDocuments()

  // ---------------------------------------------------------------- Reports
  const reportDefs = [
    {
      reporter: "lina", reported: "sofia", reason: "Received a damaged jacket with a missing button.",
      status: "Pending", days: 1,
    },
    {
      reporter: "rania", reported: "ahmed", reason: "TV arrived with a scratched panel; support resolved it.",
      status: "Resolved", days: 6,
    },
  ]
  for (const def of reportDefs) {
    const createdAt = daysAgo(def.days)
    await upsert(
      Reports,
      { reporterUserId: users[def.reporter]._id, reportedUserId: users[def.reported]._id, reason: def.reason },
      {
        reporterUserId: users[def.reporter]._id,
        reportedUserId: users[def.reported]._id,
        reason: def.reason,
        screenshots: [],
        status: def.status,
        createdAt,
      }
    )
  }
  counts.reports = await Reports.countDocuments()

  // ---------------------------------------------------------------- Events
  const eventDefs = [
    {
      name: "Fashion Flash Sale - Denim Jackets",
      description: "A week-long limited drop on select denim from Elégance Fashion.",
      product: "F1", start: daysAgo(2), finish: daysFrom(new Date(), 7),
      originalPrice: 69.99, discountPrice: 49.99, stock: 25, shopKey: "sofia",
    },
    {
      name: "Winter Running Gear Launch",
      description: "New-season running shoes and accessories from Urban Athletics.",
      product: "S1", start: daysAgo(1), finish: daysFrom(new Date(), 14),
      originalPrice: 119.99, discountPrice: 95.99, stock: 40, shopKey: "karim",
    },
  ]
  for (const def of eventDefs) {
    const shop = shops[def.shopKey]
    const p = products[def.product].doc
    await upsert(
      Event,
      { name: def.name, productId: p._id },
      {
        name: def.name,
        description: def.description,
        productId: p._id,
        start_Date: def.start,
        finish_Date: def.finish,
        status: "Running",
        originalPrice: def.originalPrice,
        discountPrice: def.discountPrice,
        stock: def.stock,
        images: [{ public_id: `event-${def.product.toLowerCase()}`, url: img(def.name) }],
        shopId: String(shop._id),
        shop: { _id: shop._id, name: shop.name, avatar: shop.avatar },
        sold_out: 4,
      }
    )
  }
  counts.events = await Event.countDocuments()

  // ---------------------------------------------------------------- Report
  await mongoose.disconnect()

  console.log("=======================================")
  console.log("SEED COMPLETE")
  console.log("=======================================")
  for (const [entity, count] of Object.entries(counts)) {
    console.log(`${entity.padEnd(22)} ${String(count).padStart(5)}`)
  }
  console.log("---------------------------------------")
  console.log("Test accounts (password: Password@123):")
  console.log("  Admin   -> admin@example.com")
  console.log("  Admin   -> system.admin@example.com")
  console.log("  Seller  -> ahmed.benali@gmail.com  (TechNova Digital)")
  console.log("  Seller  -> sofia.mansouri@gmail.com (Elégance Fashion)")
  console.log("  Seller  -> karim.haddadi@gmail.com (Urban Athletics)")
  console.log("  Seller  -> nour.djellaoui@gmail.com (Maison & Lumière)")
  console.log("  Customer-> lina.boudiaf@gmail.com  (new, cart + wishlist)")
  console.log("  Customer-> omar.zeddam@gmail.com   (new, no activity)")
  console.log("  Customer-> yacine.meziane@gmail.com (delivered orders, reviews)")
  console.log("  Customer-> amel.saidi@gmail.com    (repeat buyer, many statuses)")
  console.log("  Customer-> rania.cherif@gmail.com  (refund/on-hold, shipped)")
  console.log("  Customer-> mehdi.touhami@gmail.com (cancelled + returned)")
  console.log("  Customer-> nadia.belkacem@gmail.com (high-value orders)")
}

main().catch(err => {
  console.error("Seed failed:", err)
  process.exit(1)
})