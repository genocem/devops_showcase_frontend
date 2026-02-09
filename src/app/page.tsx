export default function Home() {
  return (
    <div>
      <h1>DevOps Showcase - Microservices Testing</h1>
      <p>Use the navigation above to test different services:</p>
      <ul>
        <li><strong>Stock (Admin)</strong> - Manage inventory (add, update, delete products)</li>
        <li><strong>Shop</strong> - Browse products and add to cart</li>
        <li><strong>Cart</strong> - View cart, modify items, checkout</li>
        <li><strong>Transactions</strong> - View and update transaction status</li>
      </ul>
      
      <h2>Test Flow</h2>
      <ol>
        <li>Go to Stock page → Add some products with quantities</li>
        <li>Go to Shop page → Add products to cart</li>
        <li>Go to Cart page → Review and checkout</li>
        <li>Go to Transactions page → Update status to completed/failed</li>
      </ol>
    </div>
  );
}
