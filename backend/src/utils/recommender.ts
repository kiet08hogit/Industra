import { TfIdf } from 'natural';
import { getAllProducts } from '../db/allproducts';
import { Product } from '../type/type';

let tfidf = new TfIdf();
let productMap: Product[] = [];
let isInitialized = false;

export const initRecommender = async () => {
    if (isInitialized) return;

    try {
        console.log("Initializing Recommendation Engine...");
        const products = await getAllProducts();

        tfidf = new TfIdf();
        productMap = products as Product[];

        productMap.forEach((product) => {
            const content = `${product.name} ${product.name} ${product.category} ${product.brand || ''} ${product.description || ''}`;
            tfidf.addDocument(content);
        });

        isInitialized = true;
        console.log(`Recommender initialized with ${productMap.length} products.`);
    } catch (error) {
        console.error("Failed to initialize recommender:", error);
    }
};

export const searchWithRelevance = async (query: string): Promise<Product[]> => {
    if (!isInitialized) await initRecommender();

    const results: { index: number, measure: number }[] = [];

    tfidf.tfidfs(query, (i, measure) => {
        if (measure > 0) {
            results.push({ index: i, measure });
        }
    });

    results.sort((a, b) => b.measure - a.measure);

    return results.map(r => productMap[r.index]);
};

export const getRelatedProducts = async (productId: string | number, limit: number = 5): Promise<Product[]> => {
    if (!isInitialized) await initRecommender();

    const product = productMap.find(p => p.id == productId);
    if (!product) return [];

    const query = `${product.name} ${product.category}`;

    const results = await searchWithRelevance(query);
    return results.filter(p => p.id != productId).slice(0, limit);
};
