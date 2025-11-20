// frontend/src/pages/ui/ProductDetailsPage.tsx
import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { addItem } from "../../store/cartSlice";
import { useParams } from "react-router";
import { usePublicProduct } from "../../hooks/usePublic";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Preloader from "../../components/ui/Preloader";

const ProductDetailsPage: React.FC = () => {
  const { id = "" } = useParams();
  const { data, loading } = usePublicProduct(id);
  const product = data?.product;
  const dispatch = useDispatch<AppDispatch>();

  const images: string[] = useMemo(() => {
    const imgs = Array.isArray(product?.images) ? product.images : [];
    return imgs.map((i: string) => `${import.meta.env.VITE_BACKEND_URL}${i}`);
  }, [product]);

  const [activeImg, setActiveImg] = useState<string | null>(null);
  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>({});

  const priceMin = useMemo(() => {
    if (product?.type === "variable") {
      const prices = (product?.variations || []).map((v: any) => Number(v.price || 0));
      return prices.length ? Math.min(...prices) : 0;
    }
    return Number(product?.price || 0);
  }, [product]);

  const priceMax = useMemo(() => {
    if (product?.type === "variable") {
      const prices = (product?.variations || []).map((v: any) => Number(v.price || 0));
      return prices.length ? Math.max(...prices) : 0;
    }
    return Number(product?.price || 0);
  }, [product]);

  const attributesMap = useMemo(() => {
    const map: Record<string, { name: string; values: string[] }> = {};
    const variations = Array.isArray(product?.variations) ? product!.variations : [];
    variations.forEach((v: any) => {
      (v.attributes || []).forEach((a: any) => {
        const slug = a?.attribute?.slug || String(a?.attribute?.name || "").toLowerCase().replace(/\s+/g, "-");
        const name = a?.attribute?.name || slug;
        if (!slug) return;
        if (!map[slug]) map[slug] = { name, values: [] };
        if (a?.value && !map[slug].values.includes(a.value)) map[slug].values.push(a.value);
      });
    });
    return map;
  }, [product]);

  const matchedVariation = useMemo(() => {
    if (!product || product.type !== "variable") return null;
    const variations = Array.isArray(product.variations) ? product.variations : [];
    const keys = Object.keys(attributesMap);
    if (!keys.length) return null;
    return (
      variations.find((v: any) => {
        const attrs = Array.isArray(v.attributes) ? v.attributes : [];
        return attrs.every((a: any) => {
          const slug = a?.attribute?.slug || String(a?.attribute?.name || "").toLowerCase().replace(/\s+/g, "-");
          const sel = selectedAttrs[slug];
          return sel && sel === a?.value;
        });
      }) || null
    );
  }, [product, attributesMap, selectedAttrs]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <PageMeta
        title={`${product?.name || "Product"} | EcomPro`}
        description={product?.description?.slice(0, 160) || "Product details"}
      />
      <div className="container mx-auto px-4 sm:px-6 py-10">
        <PageBreadcrumb pageTitle={product?.name || "Product"} />

        {loading ? (
          <div className="flex justify-center py-12">
            <Preloader />
          </div>
        ) : !product ? (
          <div className="text-center py-12 text-gray-700 dark:text-gray-300">
            Product not found
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-4 sm:p-6">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                <img
                  src={activeImg || images[0] || (import.meta.env.VITE_PLACEHOLDER_IMAGE || "https://via.placeholder.com/600x450.png?text=No+Image")}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="flex gap-3 mt-4 overflow-x-auto">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(src)}
                      className={`h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg border ${activeImg === src ? "border-blue-600" : "border-gray-200 dark:border-gray-700"}`}
                    >
                      <img src={src} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
                  {product.name}
                </h1>
                <div className="mt-2 text-gray-600 dark:text-gray-300">
                  {product.brand?.name ? <span>Brand: {product.brand.name}</span> : null}
                  {product.category?.name ? (
                    <span className="ml-4">Category: {product.category.name}</span>
                  ) : null}
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                {product.type === "variable" && matchedVariation ? (
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    ${Number(matchedVariation.price || 0).toFixed(2)}
                  </span>
                ) : (
                  <>
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      ${Number(priceMin).toFixed(2)}
                    </span>
                    {product.type === "variable" && priceMax > priceMin && (
                      <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                        - ${Number(priceMax).toFixed(2)}
                      </span>
                    )}
                  </>
                )}
                {product.type === "variable" && !matchedVariation && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">From</span>
                )}
              </div>

              {product.type === "variable" && Object.keys(attributesMap).length > 0 && (
                <div className="space-y-6">
                  {Object.entries(attributesMap).map(([slug, conf]) => (
                    <div key={slug} className="flex flex-col gap-2">
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-100">
                        {conf.name}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {conf.values.map((val) => {
                          const active = selectedAttrs[slug] === val;
                          return (
                            <button
                              key={val}
                              onClick={() => setSelectedAttrs((s) => ({ ...s, [slug]: val }))}
                              className={`px-3 py-2 rounded-lg text-sm border transition
                                ${active ? "border-blue-600 bg-blue-600 text-white" : "border-gray-200 bg-gray-100 text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"}
                              `}
                            >
                              {val}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  {matchedVariation && (
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Selected variation
                    </div>
                  )}
                </div>
              )}

              <div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {product.description || "No description available."}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  disabled={product.type === "variable" && !matchedVariation}
                  onClick={() => {
                    if (!product) return;
                    const variantKey = matchedVariation
                      ? (matchedVariation.attributes || [])
                          .map((a: any) => `${a.attribute?.slug || a.attribute?.name}:${a.value}`)
                          .join("|")
                      : undefined;
                    const price = matchedVariation ? Number(matchedVariation.price || 0) : Number(product.price || 0);
                    const image = images[0] || (import.meta.env.VITE_PLACEHOLDER_IMAGE || "");
                    dispatch(
                      addItem({
                        productId: product._id || id,
                        name: product.name,
                        price,
                        image,
                        variantKey,
                        variationId: matchedVariation?._id || matchedVariation?.id,
                        attributes: matchedVariation
                          ? Object.fromEntries(
                              (matchedVariation.attributes || []).map((a: any) => [
                                a.attribute?.slug || a.attribute?.name,
                                a.value,
                              ])
                            )
                          : undefined,
                      })
                    );
                  }}
                  className="flex-1 sm:flex-none px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 active:scale-95 transition disabled:opacity-50"
                >
                  🛒 Add to Cart
                </button>
                <button className="flex-1 sm:flex-none px-6 py-3 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 active:scale-95 transition dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700">
                  ♥ Add to Wishlist
                </button>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                {product.type !== "simple" && (
                  matchedVariation ? (
                    <span>Selected variation</span>
                  ) : (
                    <span>Select options to see price</span>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;