import { useEffect } from "react";

export const useViewportOverlayCanvas = () => {
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.bottom = "0";
    canvas.style.left = "0";
    canvas.style.right = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "9999";
    document.body.appendChild(canvas);

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const r = new ResizeObserver(setSize);
    r.observe(document.body);

    const draw: FrameRequestCallback = () => {
      // console.log(t);

      const ctx = canvas.getContext("2d");
      if (ctx) {
        const w = canvas.width;
        const h = canvas.height;
        ctx.reset();

        // const a = (Math.PI * 2 * t) / 10000;
        // ctx.save();
        // ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
        // ctx.ellipse(w / 2, h / 2, w / 2, h / 2, a, a, a + Math.PI * 2, false);
        // ctx.closePath();
        // ctx.fill();
        // ctx.restore();

        ctx.save();
        ctx.strokeStyle = "rgba(0, 255, 0, 0.3)";
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(w, h);
        ctx.moveTo(w, 0);
        ctx.lineTo(0, h);
        ctx.stroke();
        ctx.restore();
      }

      handle = requestAnimationFrame(draw);
    };

    let handle = requestAnimationFrame(draw);

    return () => {
      document.body.removeChild(canvas);
      r.unobserve(document.body);
      cancelAnimationFrame(handle);
    };
    //
  }, []);
};
