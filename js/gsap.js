import { gsap } from "gsap";

gsap.to(".text, .logo", {
  y: 0,
  duration: 0.8,
  ease: "power3.out",
});
