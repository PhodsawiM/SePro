export default function Mart() {
    const mockItems = [
      { id: 1, name: 'Lavender Soap', price: '5.99', image: 'https://via.placeholder.com/150' },
      { id: 2, name: 'Honey Shampoo', price: '8.50', image: 'https://via.placeholder.com/150' },
      { id: 3, name: 'Coconut Lotion', price: '6.75', image: 'https://via.placeholder.com/150' },
      { id: 4, name: 'Rose Face Mist', price: '9.20', image: 'https://via.placeholder.com/150' },
      { id: 5, name: 'Mint Conditioner', price: '7.30', image: 'https://via.placeholder.com/150' },
      { id: 6, name: 'Green Tea Cleanser', price: '11.40', image: 'https://via.placeholder.com/150' },
    ];
  
    return (
      <div className='flex min-h-screen bg-gray-50'>
        {/* Sidebar */}
        <div className='w-60 bg-white shadow-lg p-4 space-y-4 border-r'>
          <h2 className='text-xl font-bold mb-6'>🛒 Mart Menu</h2>
          <ul className='space-y-3'>
            <li className='flex items-center space-x-2 text-gray-700 hover:text-blue-600 cursor-pointer'>
              <span className='w-5 h-5'>🛍️</span> {/* Shopping bag icon replaced */}
              <span>All Products</span>
            </li>
            <li className='flex items-center space-x-2 text-gray-700 hover:text-blue-600 cursor-pointer'>
              <span className='w-5 h-5'>📋</span> {/* List icon replaced */}
              <span>Categories</span>
            </li>
            <li className='flex items-center space-x-2 text-gray-700 hover:text-blue-600 cursor-pointer'>
              <span className='w-5 h-5'>⚙️</span> {/* Settings icon replaced */}
              <span>Settings</span>
            </li>
          </ul>
        </div>
  
        {/* Product Grid */}
        <div className='flex-1 p-6'>
          <h1 className='text-2xl font-semibold mb-6'>Featured Products</h1>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>
            {mockItems.map((item) => (
              <div
                key={item.id}
                className='bg-white shadow-md rounded-xl p-4 flex flex-col items-center text-center hover:shadow-lg transition'
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className='w-24 h-24 object-cover rounded-full mb-3'
                />
                <h2 className='text-sm font-semibold'>{item.name}</h2>
                <p className='text-sm text-green-600 font-medium mt-1'>${item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  