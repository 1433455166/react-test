/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from "react";
// import styles from "./index.module.scss";
// import "./raf.js"

const ScrollTips = (props) => {
    const { children, wrapStyle } = props;
    const wrapRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        let animationFrameId;
        let timerId;
        let isScroll = false;
        let offset = 0;
        let sl = 0;

        const setSl = (value) => {
            if (contentRef.current) {
                contentRef.current.style.transform = `translateX(${-value}px)`;
            }
        };
        const scroll = () => {
            // eslint-disable-next-line no-unused-expressions
            sl += 0.4;
            // eslint-disable-next-line no-unused-expressions
            setSl(sl);
            if (sl >= offset) {
                clearTimeout(timerId);
                timerId = setTimeout(() => {
                    sl = 0;
                    setSl(0);
                    timerId = setTimeout(() => {
                        animationFrameId = requestAnimationFrame(scroll);
                    }, 1000);
                }, 1000);
            } else {
                animationFrameId = requestAnimationFrame(scroll);
            }
        };

        const onTouchStart = () => {
            clearTimeout(timerId);
            cancelAnimationFrame(animationFrameId);
        };

        const onTouchEnd = () => {
            clearTimeout(timerId);
            timerId = setTimeout(() => {
                animationFrameId = requestAnimationFrame(scroll);
            }, 2000);
        };
        const options = { passive: true };
        if (wrapRef?.current && contentRef?.current && wrapRef?.current?.clientWidth < contentRef?.current?.clientWidth) {
            isScroll = true;
            offset = contentRef?.current?.clientWidth - wrapRef?.current?.clientWidth;
            wrapRef?.current?.addEventListener("touchstart", onTouchStart, options);
            wrapRef?.current?.addEventListener("touchend", onTouchEnd, options);
            animationFrameId = requestAnimationFrame(scroll);
        }

        return () => {
            animationFrameId && cancelAnimationFrame(animationFrameId);
            timerId && clearTimeout(timerId);
            if (isScroll && wrapRef?.current) {
                wrapRef?.current?.removeEventListener("touchstart", onTouchStart, options);
                // eslint-disable-next-line
                wrapRef?.current?.removeEventListener("touchend", onTouchEnd, options);
            }
        }
    }, [children]);

    const wrapDomStyle = {
        maxWidth: "100%",
        whiteSpace: "nowrap",
        overflowX: "hidden",
        overflowY: "hidden",
        ...wrapStyle,
    }

    return (
        <div ref={wrapRef} style={{ ...wrapDomStyle }}>
            <div style={{ width: "fit-content", minWidth: "100%" }} ref={contentRef}>
                {children}
            </div>
        </div>
    )
};

export default ScrollTips;