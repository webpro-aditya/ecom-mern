import React, { useState, useEffect } from 'react';

const HomePage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      title: "Summer Collection 2024",
      subtitle: "Discover the latest trends",
      description: "Up to 50% off on selected items",
      buttonText: "Shop Now",
      buttonSecondary: "View Collection",
      bgGradient: "from-blue-600 to-purple-600",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop"
    },
    {
      title: "New Arrivals",
      subtitle: "Fresh styles every day",
      description: "Be the first to get the latest trends",
      buttonText: "Explore New",
      buttonSecondary: "Best Sellers",
      bgGradient: "from-pink-500 to-orange-500",
      image: "https://images.unsplash.com/photo-1483985988255-53778121c5de?w=1200&h=600&fit=crop"
    },
    {
      title: "Premium Quality",
      subtitle: "Crafted with care",
      description: "Handpicked items for you",
      buttonText: "Discover",
      buttonSecondary: "Our Story",
      bgGradient: "from-green-500 to-teal-600",
      image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200&h=600&fit=crop"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className={`bg-gradient-to-r ${slide.bgGradient} h-full relative`}>
              <div className="absolute inset-0 bg-black bg-opacity-30"></div>
              <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
                <div className="max-w-2xl text-white">
                  <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
                    {slide.title}
                  </h1>
                  <h2 className="text-2xl md:text-3xl mb-4 font-light">
                    {slide.subtitle}
                  </h2>
                  <p className="text-xl mb-8 opacity-90">
                    {slide.description}
                  </p>
                  <div className="flex space-x-4">
                    <button className="bg-white text-gray-800 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105">
                      {slide.buttonText}
                    </button>
                    <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-gray-800 transition-all">
                      {slide.buttonSecondary}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white py-8 border-b">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                🚚
              </div>
              <h3 className="font-semibold text-gray-800">Free Shipping</h3>
              <p className="text-sm text-gray-600">On orders over $50</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                💎
              </div>
              <h3 className="font-semibold text-gray-800">Premium Quality</h3>
              <p className="text-sm text-gray-600">100% Authentic</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                🔄
              </div>
              <h3 className="font-semibold text-gray-800">Easy Returns</h3>
              <p className="text-sm text-gray-600">30-day return policy</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                🛡️
              </div>
              <h3 className="font-semibold text-gray-800">Secure Payment</h3>
              <p className="text-sm text-gray-600">SSL Encrypted</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Shop by Category</h2>
            <p className="text-gray-600 text-lg">Discover our curated collections</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2">
                <img 
                  src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop" 
                  alt="Electronics" 
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Electronics</h3>
                  <p className="text-sm opacity-90">Latest gadgets & tech</p>
                </div>
              </div>
            </div>
            
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2">
                <img 
                  src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop" 
                  alt="Fashion" 
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Fashion</h3>
                  <p className="text-sm opacity-90">Trendy clothing & accessories</p>
                </div>
              </div>
            </div>
            
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2">
                <img 
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop" 
                  alt="Home & Living" 
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Home & Living</h3>
                  <p className="text-sm opacity-90">Beautiful home essentials</p>
                </div>
              </div>
            </div>
            
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2">
                <img 
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop" 
                  alt="Beauty" 
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Beauty</h3>
                  <p className="text-sm opacity-90">Skincare & cosmetics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Carousel */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-2">Featured Products</h2>
              <p className="text-gray-600">Handpicked just for you</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 font-semibold">
              View All →
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Product 1 */}
            <div className="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop" 
                  alt="Product 1" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <button className="bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow">
                    ♥️
                  </button>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    -25%
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-gray-800 mb-2">Wireless Headphones</h3>
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    ⭐⭐⭐⭐⭐
                  </div>
                  <span className="text-sm text-gray-600 ml-2">(128)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-gray-800">$149</span>
                    <span className="text-sm text-gray-500 line-through ml-2">$199</span>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Product 2 */}
            <div className="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop" 
                  alt="Product 2" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <button className="bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow">
                    ♥️
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-gray-800 mb-2">Smart Watch</h3>
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    ⭐⭐⭐⭐⭐
                  </div>
                  <span className="text-sm text-gray-600 ml-2">(89)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-gray-800">$299</span>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Product 3 */}
            <div className="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop" 
                  alt="Product 3" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <button className="bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow">
                    ♥️
                  </button>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    New
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-gray-800 mb-2">Sunglasses</h3>
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    ⭐⭐⭐⭐
                  </div>
                  <span className="text-sm text-gray-600 ml-2">(45)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-gray-800">$89</span>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Product 4 */}
            <div className="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=300&h=300&fit=crop" 
                  alt="Product 4" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <button className="bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow">
                    ♥️
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-gray-800 mb-2">Leather Bag</h3>
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    ⭐⭐⭐⭐⭐
                  </div>
                  <span className="text-sm text-gray-600 ml-2">(167)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-gray-800">$199</span>
                    <span className="text-sm text-gray-500 line-through ml-2">$249</span>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-16 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 text-white mb-8 md:mb-0">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Summer Sale 🔥
              </h2>
              <p className="text-xl mb-6 opacity-90">
                Get up to 50% off on selected items. Limited time offer!
              </p>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <div className="text-2xl font-bold">50%</div>
                  <div className="text-sm">OFF</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <div className="text-2xl font-bold">Free</div>
                  <div className="text-sm">Shipping</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <div className="text-2xl font-bold">30</div>
                  <div className="text-sm">Day Returns</div>
                </div>
              </div>
              <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-all transform hover:scale-105">
                Shop Sale Now →
              </button>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1483985988255-53778121c5de?w=600&h=400&fit=crop" 
                alt="Sale Banner" 
                className="w-full rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 text-lg">Join thousands of satisfied customers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=60&h=60&fit=crop&crop=face" 
                  alt="Customer 1" 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">Sarah Johnson</h4>
                  <div className="flex text-yellow-400 text-sm">
                    ⭐⭐⭐⭐⭐
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Absolutely love the quality of products! The shipping was super fast and customer service is excellent. Will definitely shop here again!"
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-2">✅</span>
                <span>Verified Purchase</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face" 
                  alt="Customer 2" 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">Michael Chen</h4>
                  <div className="flex text-yellow-400 text-sm">
                    ⭐⭐⭐⭐⭐
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Best online shopping experience I've had! The website is easy to navigate and the product descriptions are very detailed. Highly recommend!"
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-2">✅</span>
                <span>Verified Purchase</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face" 
                  alt="Customer 3" 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">Emma Davis</h4>
                  <div className="flex text-yellow-400 text-sm">
                    ⭐⭐⭐⭐⭐
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "The variety of products is amazing! I found exactly what I was looking for at a great price. The return process was also very smooth."
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-2">✅</span>
                <span>Verified Purchase</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">4.9/5</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">1000+</div>
              <div className="text-gray-600">Products</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Us</h2>
            <p className="text-gray-600 text-lg">Experience the difference with our premium service</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Fast & Free Shipping</h3>
              <p className="text-gray-600">Get your orders delivered quickly and free on purchases over $50. We ship worldwide with tracking.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                <span className="text-3xl">💎</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Premium Quality</h3>
              <p className="text-gray-600">Every product is carefully selected and quality-checked to ensure you get only the best.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
                <span className="text-3xl">🛡️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Secure & Safe</h3>
              <p className="text-gray-600">Shop with confidence. Our secure checkout process protects your information at all times.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-2">Latest from Our Blog</h2>
              <p className="text-gray-600">Tips, trends, and style guides</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 font-semibold">
              View All Posts →
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop" 
                  alt="Fashion Trends" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">Fashion</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Top Fashion Trends for 2024</h3>
                <p className="text-gray-600 mb-4">Discover the latest fashion trends that will dominate this year. From colors to styles, we've got you covered.</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">March 15, 2024</span>
                  <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">Read More →</button>
                </div>
              </div>
            </article>

            <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop" 
                  alt="Tech Gadgets" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">Tech</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Must-Have Tech Gadgets</h3>
                <p className="text-gray-600 mb-4">Explore the coolest tech gadgets that will make your life easier and more fun in 2024.</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">March 12, 2024</span>
                  <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">Read More →</button>
                </div>
              </div>
            </article>

            <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&h=300&fit=crop" 
                  alt="Home Decor" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">Lifestyle</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Home Decor Ideas</h3>
                <p className="text-gray-600 mb-4">Transform your living space with these amazing home decor tips and tricks that won't break the bank.</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">March 10, 2024</span>
                  <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">Read More →</button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Brands We Carry Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Brands We Carry</h2>
            <p className="text-gray-600 text-lg">Shop from your favorite brands all in one place</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center">
            <div className="text-center group">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors">
                <span className="text-2xl font-bold text-gray-600">NIKE</span>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors">
                <span className="text-2xl font-bold text-gray-600">ADIDAS</span>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors">
                <span className="text-2xl font-bold text-gray-600">PUMA</span>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors">
                <span className="text-2xl font-bold text-gray-600">ZARA</span>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors">
                <span className="text-2xl font-bold text-gray-600">H&M</span>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors">
                <span className="text-2xl font-bold text-gray-600">UNIQLO</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Follow Us on Instagram</h2>
            <p className="text-gray-300 text-lg">@ecompro - Share your style with #EcomProStyle</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden group cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=300&fit=crop" 
                alt="Instagram 1" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            
            <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden group cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=300&fit=crop" 
                alt="Instagram 2" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            
            <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden group cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1483985988255-53778121c5de?w=300&h=300&fit=crop" 
                alt="Instagram 3" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            
            <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden group cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=300&h=300&fit=crop" 
                alt="Instagram 4" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            
            <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden group cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop" 
                alt="Instagram 5" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            
            <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden group cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=300&h=300&fit=crop" 
                alt="Instagram 6" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>
          
          <div className="text-center mt-8">
            <button className="bg-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-700 transition-colors">
              Follow @ecompro →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;