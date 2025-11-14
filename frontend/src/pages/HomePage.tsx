import React, { useState, useEffect } from "react";

// --- Types (unchanged, copy as-is) ---
interface Banner {
  _id: string;
  title: string;
  image: string;
  htmlContent: string;
  redirectUrl: string;
}
interface Category {
  _id: string;
  name: string;
  slug: string;
  parent: string | null;
  image: string;
}
interface featuredProduct {
  _id: string;
  name: string;
  slug: string;
  price: string;
  image: string;
}
interface Testimonial {
  _id: string;
  name: string;
  image: string;
  text: string;
  rating: number;
  verifiedPurchase: boolean;
  designation: string;
}
interface HomeData {
  banners: Banner[];
  categories: Category[];
  featuredProducts: featuredProduct[];
  testimonials: Testimonial[];
}

// --- Helper Functions (unchanged) ---
const renderStars = (rating: number) => {
  const fullStars = "⭐".repeat(Math.floor(rating));
  const emptyStars = "☆".repeat(5 - Math.floor(rating));
  return (
    <>
      {fullStars} {emptyStars}
    </>
  );
};

function sanitizeHtml(input: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(input, "text/html");
  const walk = (node: any) => {
    const scriptsAndStyles = ["SCRIPT", "STYLE", "IFRAME"];
    if (scriptsAndStyles.includes(node.nodeName)) {
      node.remove();
      return;
    }
    if (node.attributes) {
      Array.from(node.attributes).forEach((attr: any) => {
        const name = attr.name.toLowerCase();
        const value = String(attr.value || "").toLowerCase();
        const isEvent = name.startsWith("on");
        const isJsUrl =
          name === "href" || name === "src"
            ? value.startsWith("javascript:")
            : false;
        if (isEvent || isJsUrl) node.removeAttribute(attr.name);
      });
    }
    Array.from(node.childNodes).forEach(walk);
  };
  Array.from(doc.body.childNodes).forEach(walk);
  return doc.body.innerHTML;
}

// --- Main Component ---
const HomePage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}public/home`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const result = await response.json();
        if (result.success && result.data) {
          setHomeData(result.data);
          setError(null);
        } else {
          throw new Error("Failed to fetch homepage data");
        }
      } catch (err: any) {
        setError(err?.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  useEffect(() => {
    if (!homeData?.banners || homeData.banners.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % homeData.banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [homeData?.banners]);

  // Loading/Error/no data states
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 dark:text-gray-100">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 dark:bg-gray-900 dark:text-red-400">
        Error: {error}
      </div>
    );
  if (!homeData)
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 dark:text-gray-100">
        No data found.
      </div>
    );

  const topLevelCategories = homeData.categories.filter(
    (cat) => cat.parent === null
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section (Dynamic) */}
      <section className="relative h-[600px] overflow-hidden">
        {homeData.banners.map((banner, index) => (
          <div
            key={banner._id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="h-full relative bg-cover bg-center"
              style={{
                background: `url(${import.meta.env.VITE_BACKEND_URL}${
                  banner.image
                })`,
              }}
            >
              <div className="absolute inset-0 bg-opacity-40 dark:bg-opacity-60"></div>
              <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
                <div className="max-w-2xl text-white">
                  <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
                    {banner.title}
                  </h1>
                  <div
                    className="text-xl mb-8 opacity-90 hero-content"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(banner.htmlContent),
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {homeData.banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-white dark:bg-gray-300"
                  : "bg-white bg-opacity-50 dark:bg-gray-500 dark:bg-opacity-50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Trust Badges (Static) */}
      <section className="bg-white dark:bg-gray-800 py-8 border-b dark:border-gray-700">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2 dark:bg-blue-900">
                🚚
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                Free Shipping
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                On orders over $50
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2 dark:bg-green-900">
                💎
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                Premium Quality
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                100% Authentic
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2 dark:bg-purple-900">
                🔄
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                Easy Returns
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                30-day return policy
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2 dark:bg-orange-900">
                🛡️
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                Secure Payment
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                SSL Encrypted
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section (Dynamic) */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Discover our curated collections
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {topLevelCategories.slice(0, 4).map((category) => {
              const subcategories = homeData.categories
                .filter((cat) => cat.parent === category._id)
                .map((c) => c.name)
                .join(", ");
              return (
                <a
                  href={`/category/${category.slug}`}
                  key={category._id}
                  className="group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2 dark:bg-gray-800">
                    <img
                      src={
                        category.image
                          ? `${import.meta.env.VITE_BACKEND_URL}${
                              category.image
                            }`
                          : `${import.meta.env.VITE_PLACEHOLDER_IMAGE}`
                      }
                      alt={category.name}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">
                        {category.name}
                      </h3>
                      <p className="text-sm opacity-90">
                        {subcategories || "View Collection"}
                      </p>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products Carousel (Dynamic) */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                Featured Products
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Handpicked just for you
              </p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 font-semibold dark:text-blue-400 dark:hover:text-blue-300">
              View All →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {homeData.featuredProducts?.map((featuredProduct, index) => (
              <div
                key={featuredProduct._id}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="relative">
                  <img
                    src={
                      featuredProduct?.image ||
                      `${import.meta.env.VITE_BACKEND_URL}${
                        featuredProduct?.variations[0]?.images[0]
                      }`
                    }
                    alt={featuredProduct.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <button className="bg-white dark:bg-gray-700 rounded-full p-2 shadow-md hover:shadow-lg transition-shadow">
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
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    {featuredProduct.name}
                  </h3>
                  <div className="flex items-center mb-2"></div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        ${featuredProduct.variations[0].price}
                      </span>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-400">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
              <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-all transform hover:scale-105 dark:bg-gray-900 dark:text-pink-300">
                Shop Sale Now →
              </button>
            </div>
            <div className="md:w-1/2">
              <img
                src="images/home/summer-sale.jpg"
                alt="Sale Banner"
                className="w-full rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section (Dynamic) */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Join thousands of satisfied customers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {homeData.testimonials.map((testimonial) => (
              <div
                key={testimonial._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100">
                      {testimonial.name}
                    </h4>
                    <div className="flex text-yellow-400 text-sm">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  "{testimonial.text}"
                </p>
                {testimonial.verifiedPurchase && (
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-300">
                    <span className="mr-2">✅</span>
                    <span>Verified Purchase</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                50K+
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                Happy Customers
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                4.9/5
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                Average Rating
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                1000+
              </div>
              <div className="text-gray-600 dark:text-gray-300">Products</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                24/7
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                Customer Support
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section (Static) */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Why Choose Us
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Experience the difference with our premium service
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 dark:bg-blue-900 dark:group-hover:bg-blue-800 transition-colors">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Fast & Free Shipping
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get your orders delivered quickly and free on purchases over
                $50. We ship worldwide with tracking.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 dark:bg-green-900 dark:group-hover:bg-green-800 transition-colors">
                <span className="text-3xl">💎</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Premium Quality
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Every product is carefully selected and quality-checked to
                ensure you get only the best.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 dark:bg-purple-900 dark:group-hover:bg-purple-800 transition-colors">
                <span className="text-3xl">🛡️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Secure & Safe
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Shop with confidence. Our secure checkout process protects your
                information at all times.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                Latest from Our Blog
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Tips, trends, and style guides
              </p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 font-semibold dark:text-blue-400 dark:hover:text-blue-300">
              View All Posts →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Repeat for each blog article as you have logic already */}
            {/* Copy your blog post samples, add dark: classnames to .bg-white and .text-gray-800 */}
            {/* Example: */}
            <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
              {/* ...the rest unchanged, similar pattern as above... */}
            </article>
            {/* ...repeat for other blog cards... */}
          </div>
        </div>
      </section>

      {/* Brands We Carry Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Brands We Carry
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Shop from your favorite brands all in one place
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center">
            {/* Add dark:bg-gray-700 class to bg-gray-100 elements */}
            <div className="text-center group">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 dark:bg-gray-700 dark:group-hover:bg-gray-600 transition-colors">
                <span className="text-2xl font-bold text-gray-600 dark:text-gray-200">
                  NIKE
                </span>
              </div>
            </div>
            {/* ...repeat for other brands... */}
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Follow Us on Instagram</h2>
            <p className="text-gray-300 text-lg">
              @ecompro - Share your style with #EcomProStyle
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {/* Cards do not need extra changes, as bg-gray-900 and bg-gray-800 are dark mode colors */}
            {/* ...repeat for image cards... */}
          </div>
          <div className="text-center mt-8">
            <button className="bg-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-700 transition-colors dark:bg-pink-500 dark:hover:bg-pink-600">
              Follow @ecompro →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
