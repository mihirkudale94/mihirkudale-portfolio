import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const InteractiveGlow = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 40, stiffness: 100, mass: 1 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);

    useEffect(() => {
        // Only animate on non-touch devices
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) return;

        const handleMouseMove = (e) => {
            // Get percentages of screen
            const xPct = (e.clientX / window.innerWidth) - 0.5;
            const yPct = (e.clientY / window.innerHeight) - 0.5;

            // Move by max 20vw/vh
            mouseX.set(xPct * window.innerWidth * 0.4);
            mouseY.set(yPct * window.innerHeight * 0.4);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <>
            {/* Base static ambient light */}
            <div
                aria-hidden="true"
                className="absolute top-[-10%] left-[-5%] h-[500px] w-[500px] rounded-full bg-blue-400/10 blur-[120px] pointer-events-none"
            />
            <div
                aria-hidden="true"
                className="absolute bottom-[-10%] right-[-5%] h-[450px] w-[450px] rounded-full bg-violet-300/10 blur-[120px] pointer-events-none"
            />

            {/* Interactive mouse-following spotlight */}
            <motion.div
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 -ml-[300px] -mt-[300px] h-[600px] w-[600px] rounded-full mix-blend-multiply opacity-50 blur-[120px] pointer-events-none bg-gradient-to-tr from-cyan-300/30 to-blue-400/30 hidden md:block"
                style={{
                    x: smoothX,
                    y: smoothY,
                }}
            />
        </>
    );
};
