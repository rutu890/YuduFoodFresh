export const restaurants = [
  { id: 'r1', name: 'Nizam Dum House', cuisine: 'Biryani · Mughlai', area: 'Madhapur, Hyderabad', rating: 4.5, time: '30–35 min', distance: '2.4 km', price: 350, offer: '50% OFF up to ₹100', image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=1000', featured: true, veg: false },
  { id: 'r2', name: 'Fire & Crust', cuisine: 'Pizza · Italian', area: 'Madhapur, Hyderabad', rating: 4.4, time: '25–30 min', distance: '3.1 km', price: 450, offer: '20% OFF', image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=1000', featured: true, veg: false },
  { id: 'r3', name: 'Dosa Corner', cuisine: 'South Indian', area: 'Hitech City, Hyderabad', rating: 4.8, time: '15–20 min', distance: '1.4 km', price: 180, offer: 'FREE DELIVERY', image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=1000', featured: false, veg: true },
  { id: 'r4', name: 'Tiffin Tales', cuisine: 'South Indian · Snacks', area: 'Kondapur, Hyderabad', rating: 4.3, time: '20–25 min', distance: '2.0 km', price: 220, offer: '15% OFF', image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=1000', featured: false, veg: true },
  { id: 'r5', name: 'Spice Garden', cuisine: 'North Indian · Biryani', area: 'Madhapur, Hyderabad', rating: 4.6, time: '25–30 min', distance: '2.1 km', price: 400, offer: '₹100 OFF', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1000', featured: false, veg: false },
];

export const menuItems = [
  { id: 'm1', restaurantId: 'r1', restaurant: 'Nizam Dum House', name: 'Chicken Dum Biryani', description: 'Fragrant basmati rice layered with tender chicken and slow-cooked dum spices.', price: 329, category: 'Bestseller', image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=800', veg: false },
  { id: 'm2', restaurantId: 'r1', restaurant: 'Nizam Dum House', name: 'Paneer Tikka', description: 'Char-grilled paneer cubes with mint chutney.', price: 249, category: 'Starters', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800', veg: true },
  { id: 'm3', restaurantId: 'r1', restaurant: 'Nizam Dum House', name: 'Veg Dum Biryani', description: 'Aromatic basmati rice with seasonal vegetables.', price: 249, category: 'Biryani', image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800', veg: true },
  { id: 'm4', restaurantId: 'r2', restaurant: 'Fire & Crust', name: 'Farmhouse Pizza', description: 'Loaded with peppers, olives, onion and mozzarella.', price: 399, category: 'Pizza', image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=800', veg: true },
  { id: 'm5', restaurantId: 'r3', restaurant: 'Dosa Corner', name: 'Ghee Podi Dosa', description: 'Crispy dosa with ghee, podi and coconut chutney.', price: 119, category: 'South Indian', image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800', veg: true },
];
