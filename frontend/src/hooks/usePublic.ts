import { useEffect, useState } from "react";

const API = import.meta.env.PROD ? `${window.location.origin}/api/public/` : `${import.meta.env.VITE_API_URL}public/`;

function useFetch<T>(path: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(`${API}${path}`, { credentials: "include", ...(options || {}) })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Request failed");
        if (mounted) setData(json);
      })
      .catch((e) => mounted && setError(e.message))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [path]);
  return { data, loading, error } as const;
}

export function usePublicCategories() {
  return useFetch<{ success: boolean; categories: Array<{ name: string; slug?: string; parent?: string; image: string }> }>("categories");
}

export function usePublicNewArrivals(limit = 12) {
  return useFetch<{ success: boolean; products: any[] }>(`products/new?limit=${limit}`);
}

export function usePublicSaleProducts(limit = 12) {
  return useFetch<{ success: boolean; products: any[] }>(`products/sale?limit=${limit}`);
}

export function usePublicFAQs() {
  return useFetch<{ success: boolean; faqs: Array<{ q: string; a: string }> }>("faqs");
}

export function usePublicPage(slug: string) {
  return useFetch<{ success: boolean; page: { title: string; html: string } }>(`pages/${slug}`);
}

export function usePublicContact() {
  return useFetch<{ success: boolean; contact: { email: string; phone: string; address: string } }>("contact");
}

