import { apiClient } from "./api-client";
import { Category, Product, Modifier, ProductVariant } from "@/types";

class MenuService {
  async getCategories(organizationId: string) {
    const response = await apiClient.get<Category[]>("/menu/categories", {
      params: { organizationId },
    });
    return response.data;
  }

  async getCategory(id: string) {
    const response = await apiClient.get<Category>(`/menu/categories/${id}`);
    return response.data;
  }

  async createCategory(data: Partial<Category>) {
    const response = await apiClient.post<Category>("/menu/categories", data);
    return response.data;
  }

  async updateCategory(id: string, data: Partial<Category>) {
    const response = await apiClient.patch<Category>(`/menu/categories/${id}`, data);
    return response.data;
  }

  async deleteCategory(id: string) {
    const response = await apiClient.delete(`/menu/categories/${id}`);
    return response.data;
  }

  async getProducts(organizationId: string, categoryId?: string) {
    const response = await apiClient.get<Product[]>("/menu/products", {
      params: { organizationId, categoryId },
    });
    return response.data;
  }

  async getProduct(id: string) {
    const response = await apiClient.get<Product>(`/menu/products/${id}`);
    return response.data;
  }

  async createProduct(data: Partial<Product>) {
    const response = await apiClient.post<Product>("/menu/products", data);
    return response.data;
  }

  async updateProduct(id: string, data: Partial<Product>) {
    const response = await apiClient.patch<Product>(`/menu/products/${id}`, data);
    return response.data;
  }

  async deleteProduct(id: string) {
    const response = await apiClient.delete(`/menu/products/${id}`);
    return response.data;
  }

  async getVariants(productId: string) {
    const response = await apiClient.get<ProductVariant[]>("/menu/variants", {
      params: { productId },
    });
    return response.data;
  }

  async createVariant(data: Partial<ProductVariant>) {
    const response = await apiClient.post<ProductVariant>("/menu/variants", data);
    return response.data;
  }

  async getModifiers(organizationId: string) {
    const response = await apiClient.get<Modifier[]>("/menu/modifiers", {
      params: { organizationId },
    });
    return response.data;
  }

  async createModifier(data: Partial<Modifier>) {
    const response = await apiClient.post<Modifier>("/menu/modifiers", data);
    return response.data;
  }
}

export const menuService = new MenuService();
export default MenuService;
