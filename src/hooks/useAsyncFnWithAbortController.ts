import { fetchWithType } from "@/utils/common";
import { useEffect, useState } from "react";

export default function useFetchWithAbortController<T>(
    url: string, options?: RequestInit, deps: any[] = []
) {
    const [response, setResponse] = useState<T>();
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const controller = new AbortController();
        const signal =  controller.signal;

        setLoading(true);

        if (!options) {
            options = {}
        }
        options.signal = signal;

        const asyncFn = async () => {
            try {
                setResponse(await fetchWithType<T>(url, options));
            } catch(e) {
                
            } finally {
                setLoading(false);
            }
        }

        asyncFn();

        return () => {
            controller.abort();
        }
    }, deps);

    return {
        response, loading
    };
}