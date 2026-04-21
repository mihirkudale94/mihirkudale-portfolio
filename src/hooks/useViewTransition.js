/**
 * View Transitions API Hook (2026 Standard)
 * Provides smooth page transitions using the native View Transitions API
 * with graceful fallback for unsupported browsers.
 */

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Hook to navigate with View Transitions API
 * @returns {Object} - { navigateWithTransition, isSupported }
 */
export function useViewTransition() {
    const navigate = useNavigate();

    const isSupported = typeof document !== "undefined" && "startViewTransition" in document;

    const navigateWithTransition = useCallback(
        (to, options = {}) => {
            const performNavigation = () => navigate(to, options);

            // Use View Transitions API if supported
            if (isSupported) {
                document.startViewTransition(performNavigation);
            } else {
                // Fallback for unsupported browsers
                performNavigation();
            }
        },
        [navigate, isSupported]
    );

    return {
        navigateWithTransition,
        isSupported,
    };
}

/**
 * Utility function for View Transitions outside React components
 * @param {Function} callback - Function to execute within the transition
 * @returns {ViewTransition|undefined} - The ViewTransition object if supported
 */
export function startViewTransition(callback) {
    if (typeof document !== "undefined" && "startViewTransition" in document) {
        return document.startViewTransition(callback);
    }
    // Fallback: just run the callback
    callback();
    return undefined;
}

export default useViewTransition;
